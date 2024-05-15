const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDb = require('./config/dbConnection.js');

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
connectDb();

// Enable CORS with specific settings
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the React app
const buildpath = path.join(__dirname, './client/build');
app.use(express.static(buildpath));

// Import and use routes
const panShopRoutes = require('./routes/panShopRoutes.js');
const panShopOwnerRoutes = require('./routes/panShopOwnerRoutes.js');

app.use('/api/panshop/order', panShopRoutes);
app.use('/api/panShopLogin', panShopOwnerRoutes);

// Catch-all handler to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(buildpath, 'index.html'));
});

module.exports = app;
