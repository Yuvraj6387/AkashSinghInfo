const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // In production, use ALLOWED_ORIGINS from env
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
      : ['http://localhost:3000', 'http://localhost:5173'];
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS blocked - Origin:', origin, 'Allowed:', allowedOrigins);
      callback(null, true); // Allow for now for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Static folder for PDF uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working' });
});

// Routes
try {
  const adminRoutes = require('./routes/adminRoutes');
  const jobRoutes = require('./routes/jobRoutes');
  
  app.use('/api/admin', adminRoutes);
  app.use('/api', jobRoutes);
  
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

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
