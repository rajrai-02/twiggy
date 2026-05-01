const amqp = require('amqplib');

let connection;
let channel;

const connectRabbitMQ = async () => {
  try {
    const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();
    console.log('RabbitMQ Connected');
    
    // Setup essential queues
    await channel.assertQueue('orders_queue', { durable: true });
    await channel.assertQueue('email_queue', { durable: true });
    
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error);
    process.exit(1);
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ Channel not initialized');
  }
  return channel;
};

module.exports = { connectRabbitMQ, getChannel };
