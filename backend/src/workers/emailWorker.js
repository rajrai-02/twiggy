const amqp = require('amqplib');
const { logError } = require('../utils/logger');
// const emailjs = require('@emailjs/nodejs'); // You'd install and configure this

const startEmailWorker = async () => {
  try {
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
            
            // Here you would call EmailJS to send the email
            console.log(`[EmailWorker] Sending password reset email to ${email} for user ${name}`);
            console.log(`[EmailWorker] Reset Link: http://localhost:5173/reset-password?token=${resetToken}&email=${email}`);
          }
          
          channel.ack(msg);
        } catch (jobError) {
          await logError('EmailWorker', jobError, data);
          channel.nack(msg, false, false); // Send to DLQ if configured or discard
        }
      }
    });
  } catch (error) {
    await logError('EmailWorker.Init', error);
  }
};

startEmailWorker();
