const Menu = require('../models/Menu');
const { GoogleGenAI } = require('@google/genai');

// @desc    Create or update menu for a specific date
// @route   PUT /api/v1/provider/menu/:date
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

// @desc    Get menu for a specific date
// @route   GET /api/v1/provider/menu/:date
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

// @desc    Get AI menu suggestions
// @route   POST /api/v1/provider/ai-suggest
const getAiSuggestion = async (req, res) => {
  const { historicalRatings, inventoryData } = req.body;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an expert chef and restaurant manager. Based on the following data, suggest a daily menu consisting of 4 items.
      Balance high user ratings with low-cost inventory.
      Historical Ratings: ${JSON.stringify(historicalRatings)}
      Current Inventory: ${JSON.stringify(inventoryData)}

      Return ONLY a JSON array of 4 string item names. No markdown formatting, no explanations.
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

module.exports = { upsertMenu, getMenu, getAiSuggestion };
