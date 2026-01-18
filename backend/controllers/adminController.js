const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // In production, fetch from database. For demo, using env variables
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (username === validUsername && password === validPassword) {
      const token = jwt.sign(
        { username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        admin: { username },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Token
exports.verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Logout (Client-side handled)
exports.adminLogout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};
