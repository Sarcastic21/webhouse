// models/Card.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, 
  },
 
  category:{
    type: String,
    required: true, // Store the email of the user who posted the card
  },
  Github:{
    type: String,
    required: true,
  },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to the creator (User)

}, { timestamps: true });

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
