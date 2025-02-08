import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure allowed origins (replace with your frontend URL if needed)
const allowedOrigins = [
  'https://webhouse-1le6.vercel.app', // Frontend local development URL
  'https://webhouse7.netlify.app' // Replace with your live frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow cookies if needed
};

app.use(cors(corsOptions));  // Apply CORS middleware with options
app.use(bodyParser.json());

app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api', cardRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });
