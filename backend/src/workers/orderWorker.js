const amqp = require('amqplib');
const Order = require('../models/Order');
const { logError } = require('../utils/logger');

const startOrderWorker = async () => {
  try {
    const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    
    const queue = 'orders_queue';
    await channel.assertQueue(queue, { durable: true });
    
    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);
    
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const orderData = JSON.parse(msg.content.toString());
        console.log(`[x] Received order event for user ${orderData.user_id}`);
        
        try {
          // Write to MongoDB
          const newOrder = await Order.create({
            user_id: orderData.user_id,
            provider_id: orderData.provider_id,
            date: orderData.date,
            status: 'pending'
          });
          
          console.log(`[OrderWorker] Successfully created order ID: ${newOrder._id}`);
          channel.ack(msg); // Acknowledge successful processing
        } catch (dbError) {
          await logError('OrderWorker', dbError, orderData);
          // NACK the message so it goes back to queue or Dead Letter Queue
          channel.nack(msg, false, false); 
        }
      }
    });
  } catch (error) {
    await logError('OrderWorker.Init', error);
  }
};

startOrderWorker();
