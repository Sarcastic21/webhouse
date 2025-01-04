const express = require('express');
const User = require('../models/User');
const Card = require('../models/Card');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/verify-sport', async (req, res) => {
  const { mobile, sport } = req.body;
  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.sport !== sport) {
      return res.status(400).json({ message: 'Sport does not match' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password
router.put('/update-password', async (req, res) => {
  const { mobile, newPassword } = req.body;
  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword; // Make sure to hash the password before saving it
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Register User
router.post('/register', async (req, res) => {
  const { name, email, mobile, password,sport } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, mobile, password,sport });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password' });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get User Details
router.get('/account', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/cards', async (req, res) => {
  
  const { name, image, details, link,category,creatorId,Github,} = req.body;
  const email = req.body.email || '';  // Assuming you pass the email from the frontend
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const newCard = new Card({ name, image, details, link, email,category,creatorId,Github, });
    await newCard.save();
    res.json(newCard);  // Respond with the newly created card
  } catch (err) {
    res.status(500).json({ error: 'Error posting new card' });
  }
});
// Add this to your existing `userRoutes.js` file
router.get('/cards', async (req, res) => {
  const { email } = req.query;  // Get the email from the query parameter
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const userCards = await Card.find({ email });  
    res.json(userCards);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cards' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:userId/cards', async (req, res) => {
  try {
    const cards = await Card.find({ creatorId: req.params.userId }); // Filter cards by creatorId
    if (!cards || cards.length === 0) {
      return res.status(404).json({ message: 'No cards found for this user' });
    }
    res.json(cards);
  } catch (err) {
    console.error('Error fetching user cards:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
