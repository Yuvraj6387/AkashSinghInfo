import React, { useState, useEffect } from 'react';
import { jobService } from '../services/api';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    lastDateToApply: '',
    numberOfPositions: '',
    eligibility: '',
    salary: '',
    applicationLink: '',
    status: 'Active',
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch jobs on load
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getAllJobs();
      setJobs(response.data.data);
    } catch (err) {
      setError('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('department', formData.department);
      form.append('description', formData.description);
      form.append('lastDateToApply', formData.lastDateToApply);
      form.append('numberOfPositions', formData.numberOfPositions);
      form.append('eligibility', formData.eligibility);
      form.append('salary', formData.salary);
      form.append('applicationLink', formData.applicationLink);
      form.append('status', formData.status);

      if (selectedFile) {
        form.append('pdf', selectedFile);
      }

      if (editingId) {
        await jobService.updateJob(editingId, form);
        setSuccess('Job updated successfully!');
        setEditingId(null);
      } else {
        if (!selectedFile) {
          setError('Please select a PDF file');
          return;
        }
        await jobService.createJob(form);
        setSuccess('Job created successfully!');
      }

      setFormData({
        title: '',
        department: '',
        description: '',
        lastDateToApply: '',
        numberOfPositions: '',
        eligibility: '',
        salary: '',
        applicationLink: '',
        status: 'Active',
      });
      setSelectedFile(null);
      setActiveTab('list');
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving job');
    }
  };

  const handleEdit = (job) => {
    setFormData({
      title: job.title,
      department: job.department,
      description: job.description,
      lastDateToApply: job.lastDateToApply.split('T')[0],
      numberOfPositions: job.numberOfPositions || '',
      eligibility: job.eligibility || '',
      salary: job.salary || '',
      applicationLink: job.applicationLink || '',
      status: job.status || 'Active',
    });
    setEditingId(job._id);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(id);
        setSuccess('Job deleted successfully!');
        fetchJobs();
      } catch (err) {
        setError('Error deleting job');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '',
      department: '',
      description: '',
      lastDateToApply: '',
      numberOfPositions: '',
      eligibility: '',
      salary: '',
      applicationLink: '',
      status: 'Active',
    });
    setSelectedFile(null);
    setError('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h3>Admin Menu</h3>
        <div className="sidebar-nav">
          <button
            className={`sidebar-link ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 Job List
          </button>
          <button
            className={`sidebar-link ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('form');
              handleCancel();
            }}
          >
            ➕ Add Job
          </button>
        </div>
      </aside>

      <main className="main-content">
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {activeTab === 'list' ? (
          <div>
            <h2>Job Notifications Management</h2>
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <h2>No jobs found</h2>
                <p>Add your first job notification</p>
              </div>
            ) : (
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Last Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td>{job.title}</td>
                      <td>{job.department}</td>
                      <td>{formatDate(job.lastDateToApply)}</td>
                      <td>
                        <span
                          className={`status-badge status-${job.status?.toLowerCase()}`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(job)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(job._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="form-container">
            <h2>{editingId ? 'Edit Job Notification' : 'Add New Job Notification'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <input
                  type="text"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., Defense, Railway, UPSC"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Last Date to Apply *</label>
                <input
                  type="date"
                  name="lastDateToApply"
                  className="form-input"
                  value={formData.lastDateToApply}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Positions</label>
                <input
                  type="number"
                  name="numberOfPositions"
                  className="form-input"
                  value={formData.numberOfPositions}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Eligibility</label>
                <input
                  type="text"
                  name="eligibility"
                  className="form-input"
                  value={formData.eligibility}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor's Degree, Experience required"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Salary</label>
                <input
                  type="text"
                  name="salary"
                  className="form-input"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g., 50,000 - 70,000 per month"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Application Link</label>
                <input
                  type="url"
                  name="applicationLink"
                  className="form-input"
                  value={formData.applicationLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com/apply"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  PDF Notification {!editingId && '*'}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  className="form-input"
                  onChange={handleFileChange}
                  required={!editingId}
                />
                {selectedFile && (
                  <small style={{ color: '#27ae60', marginTop: '5px', display: 'block' }}>
                    ✓ {selectedFile.name}
                  </small>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="form-submit">
                  {editingId ? 'Update Job' : 'Create Job'}
                </button>
                <button
                  type="button"
                  className="form-submit"
                  style={{ backgroundColor: '#7f8c8d' }}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
