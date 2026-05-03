const { redisClient } = require('../config/redis');

//   Update delivery partner GPS location
//   POST /api/v1/delivery/gps
const updateLocation = async (req, res) => {
  const { lat, lng, orderId } = req.body;
  const deliveryPartnerId = req.user.userId;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const locationData = {
      lat,
      lng,
      orderId: orderId || null,
      timestamp: Date.now()
    };

    // Store in Redis hash for fast access and updates
    await redisClient.hSet('delivery_locations', deliveryPartnerId, JSON.stringify(locationData));

    res.json({ message: 'Location updated', data: locationData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get live delivery partner location (for consumer app)
//   GET /api/v1/delivery/gps/:partnerId
const getLocation = async (req, res) => {
  const { partnerId } = req.params;

  try {
    const rawData = await redisClient.hGet('delivery_locations', partnerId);

    if (!rawData) {
      return res.status(404).json({ message: 'Location not found or offline' });
    }

    const locationData = JSON.parse(rawData);

    // If location is older than 5 minutes, consider the partner offline
    if (Date.now() - locationData.timestamp > 5 * 60 * 1000) {
      return res.status(404).json({ message: 'Delivery partner is offline' });
    }

    res.json(locationData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateLocation, getLocation };
