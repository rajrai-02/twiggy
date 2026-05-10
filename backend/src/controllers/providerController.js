const Menu = require('../models/Menu');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const { GoogleGenAI } = require('@google/genai');

// Create or update menu for a specific date
// PUT /api/v1/provider/menu/:date
const upsertMenu = async (req, res) => {
  const { date } = req.params;
  const { items, ai_generated } = req.body;

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  try {
    const menu = await Menu.findOneAndUpdate(
      { provider_id: req.user.userId, date: targetDate },
      { items, ai_generated: ai_generated || false },
      { new: true, upsert: true }
    );
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get menu for a specific date
// GET /api/v1/provider/menu/:date
const getMenu = async (req, res) => {
  const { date } = req.params;
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  try {
    const menu = await Menu.findOne({ provider_id: req.user.userId, date: targetDate });
    if (!menu) return res.status(404).json({ message: 'Menu not found for this date' });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get AI menu suggestions
// POST /api/v1/provider/ai-suggest
const getAiSuggestion = async (req, res) => {
  const providerId = req.user.userId;

  try {
    // 1. Fetch real historical data (past 30 days menus)
    const pastMenus = await Menu.find({ 
      provider_id: providerId,
      date: { $lt: new Date() }
    }).sort({ date: -1 }).limit(30);

    // 2. Compute "historical ratings/popularity" by counting frequency of items
    const itemPopularity = {};
    pastMenus.forEach(menu => {
      menu.items.forEach(item => {
        const lowerItem = item.toLowerCase();
        itemPopularity[lowerItem] = (itemPopularity[lowerItem] || 0) + 1;
      });
    });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an expert chef and restaurant manager. Based on the following real data, suggest a daily tiffin menu consisting of EXACTLY 4 items.
      Prioritize items that have high historical popularity (served frequently in the past), but also introduce 1 or 2 complementary new items.
      
      Historical Item Popularity (Frequency of being served in the last 30 days): 
      ${JSON.stringify(itemPopularity)}

      Return ONLY a JSON array of 4 string item names. No markdown formatting, no explanations, no json block wrappers.
      Example: ["Spicy Chicken Pasta", "Garlic Bread", "Caesar Salad", "Chocolate Brownie"]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiText = response.text.trim();
    // Clean up potential markdown formatting if Gemini still returns it
    const cleanJsonString = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

    let suggestedItems;
    try {
      suggestedItems = JSON.parse(cleanJsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', cleanJsonString);
      return res.status(500).json({ message: 'AI returned invalid format', raw: aiText });
    }

    res.json({ suggestedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Provider Dashboard Stats
// GET /api/v1/provider/dashboard
const getDashboardStats = async (req, res) => {
  const providerId = req.user.userId;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const activeSubscribers = await Subscription.countDocuments({ provider_id: providerId, status: 'active' });
    
    // Total meals today = all orders for today (excluding skipped ones if that's how it's structured)
    const todayOrders = await Order.find({ provider_id: providerId, date: today });
    const mealsToPrepare = todayOrders.filter(o => o.status !== 'skipped').length;
    const skippedToday = todayOrders.filter(o => o.status === 'skipped').length;

    // Dummy revenue for now (can be calculated based on active subs * price)
    const revenue = activeSubscribers * 1200;

    res.json({
      activeSubscribers,
      mealsToPrepare,
      skippedToday,
      revenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Today's Deliveries (Batch)
// GET /api/v1/provider/deliveries/today
const getTodayDeliveries = async (req, res) => {
  const providerId = req.user.userId;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const orders = await Order.find({ provider_id: providerId, date: today, status: { $ne: 'skipped' } })
      .populate('user_id', 'profile.name profile.address')
      .populate('delivery_partner_id', 'profile.name');
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { upsertMenu, getMenu, getAiSuggestion, getDashboardStats, getTodayDeliveries };
