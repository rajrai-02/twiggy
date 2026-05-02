const amqp = require('amqplib');
const { logError } = require('../utils/logger');
const connectDB = require('../config/db');
const emailjs = require('@emailjs/nodejs');

const startEmailWorker = async () => {
  try {
    await connectDB();
    const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const queue = 'email_queue';
    await channel.assertQueue(queue, { durable: true });

    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log(`[x] Received event: ${data.type}`);

        try {
          if (data.type === 'FORGOT_PASSWORD') {
            const { email, resetToken, name } = data.payload;

            //EmailJS to send the email
            console.log(`[EmailWorker] Sending password reset email to ${email} for user ${name}`);
            const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;
            console.log(`[EmailWorker] Reset Link: ${resetLink}`);
            
            await emailjs.send(
              process.env.EMAILJS_SERVICE_ID,
              process.env.EMAILJS_TEMPLATE_ID,
              {
                to_name: name,
                to_email: email,
                reset_link: resetLink
              },
              {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY,
              }
            );
            console.log(`[EmailWorker] Email successfully sent to ${email}`);
          }

          channel.ack(msg);
        } catch (jobError) {
          await logError('EmailWorker', jobError, data);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    await logError('EmailWorker.Init', error);
  }
};

startEmailWorker();
