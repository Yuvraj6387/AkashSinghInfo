const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/jobs', jobController.getAllJobs);
router.get('/jobs/search', jobController.searchJobs);
router.get('/jobs/:id', jobController.getJobById);
router.get('/jobs/:id/download', jobController.downloadPDF);

// Admin routes
router.post('/jobs', authMiddleware, upload.single('pdf'), jobController.createJob);
router.put('/jobs/:id', authMiddleware, upload.single('pdf'), jobController.updateJob);
router.delete('/jobs/:id', authMiddleware, jobController.deleteJob);

module.exports = router;
