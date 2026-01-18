const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    lastDateToApply: {
      type: Date,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    pdfFileName: {
      type: String,
      required: true,
    },
    pdfPath: {
      type: String,
      required: true,
    },
    numberOfPositions: {
      type: Number,
      default: 0,
    },
    eligibility: {
      type: String,
      default: '',
    },
    salary: {
      type: String,
      default: '',
    },
    applicationLink: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Expired'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting latest first
jobSchema.index({ uploadDate: -1 });

module.exports = mongoose.model('Job', jobSchema);
