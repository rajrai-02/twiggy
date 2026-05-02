const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const Order = require('../models/Order');
const { getChannel } = require('../config/rabbitmq');
const { logError } = require('../utils/logger');

const startOrderEngine = () => {
  // Run every day at 9:00 PM (21:00)
  cron.schedule('0 21 * * *', async () => {
    console.log('[Cron] Running 9 PM Order Generation Engine...');
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // 1. Fetch active subscriptions
      const activeSubscriptions = await Subscription.find({ status: 'active' });

      const channel = getChannel();

      for (const sub of activeSubscriptions) {
        // 2. Check if user skipped tomorrow's order
        const existingOrder = await Order.findOne({ user_id: sub.user_id, date: tomorrow });
        
        if (existingOrder && existingOrder.status === 'skipped') {
          console.log(`[Cron] Skipping order for user ${sub.user_id} on ${tomorrow.toDateString()}`);
          continue; // User skipped, move to next
        }

        if (!existingOrder) {
          // 3. Publish order event to RabbitMQ
          const orderPayload = {
            user_id: sub.user_id,
            provider_id: sub.provider_id,
            date: tomorrow
          };

          channel.sendToQueue('orders_queue', Buffer.from(JSON.stringify(orderPayload)));
          console.log(`[Cron] Published order creation event for user ${sub.user_id}`);
        }
      }
    } catch (error) {
      await logError('OrderEngine', error);
    }
  });

  console.log('Order Engine Cron Job initialized (runs at 9 PM daily).');
};

module.exports = startOrderEngine;
