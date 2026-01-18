const Job = require('../models/Job');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Mock data for offline mode
const MOCK_JOBS = [
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'Staff Selection Commission (SSC) Combined Graduate Level Exam',
    department: 'Staff Selection Commission',
    description: 'Recruitment for Graduate Level posts in various departments',
    lastDateToApply: '2026-02-28',
    numberOfPositions: 5000,
    eligibility: 'Bachelor\'s Degree',
    salary: '35,000 - 45,000 per month',
    applicationLink: 'https://ssc.nic.in',
    pdfFileName: 'ssc_exam_notice.pdf',
    uploadDate: new Date('2026-01-15'),
    __v: 0
  },
  {
    _id: '507f1f77bcf86cd799439012',
    title: 'Union Public Service Commission (UPSC) IAS Exam',
    department: 'UPSC',
    description: 'Recruitment for IAS, IFS, IPS and other All India Services',
    lastDateToApply: '2026-03-15',
    numberOfPositions: 1200,
    eligibility: 'Bachelor\'s Degree',
    salary: '56,100 - 177,500 per month',
    applicationLink: 'https://upsc.gov.in',
    pdfFileName: 'upsc_ias_notice.pdf',
    uploadDate: new Date('2026-01-10'),
    __v: 0
  }
];

// Get all jobs (public - latest first)
exports.getAllJobs = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Database offline, returning mock data');
      return res.json({
        success: true,
        count: MOCK_JOBS.length,
        data: MOCK_JOBS,
      });
    }

    const jobs = await Job.find()
      .sort({ uploadDate: -1 })
      .lean();

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error('Error in getAllJobs:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single job
exports.getJobById = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      const mockJob = MOCK_JOBS.find(job => job._id === req.params.id);
      if (!mockJob) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      return res.json({
        success: true,
        data: mockJob,
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create job (Admin only)
exports.createJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }

    const { title, department, description, lastDateToApply, numberOfPositions, eligibility, salary, applicationLink } = req.body;

    // Validate required fields
    if (!title || !department || !description || !lastDateToApply) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    const job = new Job({
      title,
      department,
      description,
      lastDateToApply,
      numberOfPositions,
      eligibility,
      salary,
      applicationLink,
      pdfFileName: req.file.filename,
      pdfPath: req.file.path,
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job notification created successfully',
      data: job,
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update job (Admin only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const { title, department, description, lastDateToApply, numberOfPositions, eligibility, salary, applicationLink, status } = req.body;

    // Update text fields
    if (title) job.title = title;
    if (department) job.department = department;
    if (description) job.description = description;
    if (lastDateToApply) job.lastDateToApply = lastDateToApply;
    if (numberOfPositions) job.numberOfPositions = numberOfPositions;
    if (eligibility) job.eligibility = eligibility;
    if (salary) job.salary = salary;
    if (applicationLink) job.applicationLink = applicationLink;
    if (status) job.status = status;

    // Handle PDF update
    if (req.file) {
      // Delete old PDF
      if (job.pdfPath && fs.existsSync(job.pdfPath)) {
        fs.unlinkSync(job.pdfPath);
      }
      job.pdfFileName = req.file.filename;
      job.pdfPath = req.file.path;
    }

    await job.save();

    res.json({
      success: true,
      message: 'Job notification updated successfully',
      data: job,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete job (Admin only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Delete PDF file
    if (job.pdfPath && fs.existsSync(job.pdfPath)) {
      fs.unlinkSync(job.pdfPath);
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job notification deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Download PDF
exports.downloadPDF = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Use the pdfPath directly (it's already the full path)
    const filePath = job.pdfPath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    res.download(filePath, job.pdfFileName);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search jobs
exports.searchJobs = async (req, res) => {
  try {
    const { query, department } = req.query;

    // For offline mode, search in mock data
    if (mongoose.connection.readyState !== 1) {
      let results = MOCK_JOBS;

      if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(job =>
          job.title.toLowerCase().includes(lowerQuery) ||
          job.description.toLowerCase().includes(lowerQuery) ||
          job.department.toLowerCase().includes(lowerQuery)
        );
      }

      if (department) {
        const lowerDept = department.toLowerCase();
        results = results.filter(job =>
          job.department.toLowerCase().includes(lowerDept)
        );
      }

      return res.json({
        success: true,
        count: results.length,
        data: results,
      });
    }

    let searchCriteria = {};

    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } },
      ];
    }

    if (department) {
      searchCriteria.department = { $regex: department, $options: 'i' };
    }

    const jobs = await Job.find(searchCriteria).sort({ uploadDate: -1 }).lean();

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
