import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Route to fetch all messages with populated creator information (if needed)
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).populate('creatorId', 'name'); // Populating creatorId with user name
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Route to post a new message
router.post('/messages', async (req, res) => {
  const { name, message, creatorId } = req.body;

  if (!name || !message || !creatorId) {
    return res.status(400).json({ error: 'Name, message, and creatorId are required' });
  }

  try {
    const newMessage = new Message({
      name,
      message,
      creatorId, // Save the creatorId in the message
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;
