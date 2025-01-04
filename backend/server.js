const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');  // Import the card routes
const chatRoutes = require('./routes/chatRoutes');
require('dotenv').config(); // Import and configure dotenv

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api', cardRoutes);  // Ensure the correct route is used

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected'); // Logs when MongoDB connection is successful
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`); // Logs when server is running
    });
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error); // Logs if there's an error in the connection
  });
