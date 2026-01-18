const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Admin authentication routes
router.post('/login', adminController.adminLogin);
router.get('/verify', authMiddleware, adminController.verifyToken);
router.post('/logout', authMiddleware, adminController.adminLogout);

module.exports = router;
