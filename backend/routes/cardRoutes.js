// routes/cards.js

const express = require('express');
const Card = require('../models/Card');  // Assuming your card model is named cardModel.js

const router = express.Router();

// This route doesn't require authentication, so no authMiddleware here
router.get('/cardshome', async (req, res) => {
  try {
    const cards = await Card.find();  // Fetch all cards from the database
    res.json(cards);  // Send the cards data as response
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cards' });
  }
});
router.get('/categorycards', async (req, res) => {
  const category = req.query.category; // Get the category from query string
  try {
    const cards = await Card.find({ category: category }); // Filter cards by category
    res.json(cards);
  } catch (err) {
    res.status(500).send('Error fetching cards');
  }
});

router.get('/cards/:id', async (req, res) => {
  try {
    // Find the card by ID
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Find related cards in the same category, excluding the current card
    const relatedCards = await Card.find({ 
      category: card.category, 
      _id: { $ne: card._id } 
    }).limit(5);

    // Send card details and related cards
    res.json({ card, relatedCards });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching card details' });
  }
});





module.exports = router;
