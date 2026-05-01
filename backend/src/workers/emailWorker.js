const amqp = require('amqplib');
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
        
        if (data.type === 'FORGOT_PASSWORD') {
          const { email, resetToken, name } = data.payload;
          
          // Here you would call EmailJS to send the email
          console.log(`[EmailWorker] Sending password reset email to ${email} for user ${name}`);
          console.log(`[EmailWorker] Reset Link: http://localhost:5173/reset-password?token=${resetToken}&email=${email}`);
          
          /*
          await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {
              to_name: name,
              to_email: email,
              reset_link: `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`
            },
            {
              publicKey: process.env.EMAILJS_PUBLIC_KEY,
              privateKey: process.env.EMAILJS_PRIVATE_KEY,
            }
          );
          */
        }
        
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Email Worker Error:', error);
  }
};

startEmailWorker();
