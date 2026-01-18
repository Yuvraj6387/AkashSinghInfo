const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

// Static folder for PDF uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/jobRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server BEFORE MongoDB connection attempt (non-blocking)
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
// Database Connection (async, non-blocking)
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://yuvipaji222002_db_user:hEFFjombdBzyLgD2@cluster0.zgi5dg3.mongodb.net/?appName=Cluster0';

if (!mongoUri || mongoUri === 'undefined') {
  console.log('⚠️ MongoDB URI not set. Using mock data mode.');
} else {
  mongoose
    .connect(mongoUri, { 
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    })
    .then(() => {
      console.log('✅ MongoDB connected successfully');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('📦 Server running without database connection. Using mock data.');
    });
}

module.exports = app;
