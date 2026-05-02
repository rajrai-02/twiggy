const amqp = require('amqplib');

let connection;
let channel;

const connectRabbitMQ = async () => {
  try {
    const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();
    console.log('RabbitMQ Connected');
    
    // Setup Dead Letter Exchange and Queue for failed jobs
    await channel.assertExchange('dlx', 'direct', { durable: true });
    await channel.assertQueue('dlq_orders', { durable: true });
    await channel.bindQueue('dlq_orders', 'dlx', 'orders_dlq_routing_key');

    // Setup essential queues with DLX routing
    await channel.assertQueue('orders_queue', { 
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'dlx',
        'x-dead-letter-routing-key': 'orders_dlq_routing_key'
      }
    });
    
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
