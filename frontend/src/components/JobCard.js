import React from 'react';
import { jobService } from '../services/api';

const JobCard = ({ job }) => {
  const handleDownload = async () => {
    try {
      const response = await jobService.downloadPDF(job._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', job.pdfFileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert('Error downloading PDF');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isDeadlineSoon = new Date(job.lastDateToApply) - new Date() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="job-card">
      <div className="job-header">
        <h2 className="job-title">{job.title}</h2>
        <span className="job-department">{job.department}</span>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="job-meta">
        <div className="meta-item">
          <span className="meta-label">📅 Upload Date:</span>
          <span className="meta-value">{formatDate(job.uploadDate)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">⏰ Last Date:</span>
          <span className="meta-value" style={isDeadlineSoon ? { color: '#e74c3c', fontWeight: 'bold' } : {}}>
            {formatDate(job.lastDateToApply)}
            {isDeadlineSoon && ' ⚠️ Deadline soon'}
          </span>
        </div>
        {job.numberOfPositions > 0 && (
          <div className="meta-item">
            <span className="meta-label">👥 Positions:</span>
            <span className="meta-value">{job.numberOfPositions}</span>
          </div>
        )}
        {job.salary && (
          <div className="meta-item">
            <span className="meta-label">💰 Salary:</span>
            <span className="meta-value">{job.salary}</span>
          </div>
        )}
      </div>

      {job.eligibility && (
        <div className="meta-item">
          <span className="meta-label">📚 Eligibility:</span>
          <span className="meta-value">{job.eligibility}</span>
        </div>
      )}

      <div className="job-actions">
        <button className="download-btn" onClick={handleDownload}>
          📥 Download PDF
        </button>
        {job.applicationLink && (
          <a
            href={job.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="download-btn"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            🔗 Apply Online
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;
