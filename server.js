require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Allow the server to accept JSON data in the request body
app.use(express.json());


// --- Define Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties.js'));
app.use('/api/bookings', require('./routes/bookings.js'));


// --- Function to connect to DB and start the server ---
const startServer = async () => {
  try {
    // 1. First, connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // 2. Then, start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// --- Call the function to start everything ---
startServer();