import React, { useState, useEffect } from 'react';
import { jobService } from '../services/api';
import JobCard from './JobCard';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobService.getAllJobs();
        setJobs(response.data.data);
        setFilteredJobs(response.data.data);

        // Extract unique departments
        const uniqueDepts = [...new Set(response.data.data.map((job) => job.department))];
        setDepartments(uniqueDepts);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Search and filter jobs
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim() && !filterDepartment) {
      setFilteredJobs(jobs);
      return;
    }

    try {
      setLoading(true);
      const response = await jobService.searchJobs(searchQuery, filterDepartment);
      setFilteredJobs(response.data.data);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Clear filters
  const handleClear = () => {
    setSearchQuery('');
    setFilterDepartment('');
    setFilteredJobs(jobs);
  };

  return (
    <>
      <div className="hero">
        <div className="container">
          <h1>🏛️ Government Job Portal</h1>
          <p>Find the latest government job notifications and opportunities</p>
        </div>
      </div>

      <div className="container">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by job title, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="search-select"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <button type="submit" className="search-btn">
              Search
            </button>
            <button type="button" className="search-btn" onClick={handleClear}>
              Clear
            </button>
          </form>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading job notifications...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state">
            <h2>No jobs found</h2>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="jobs-container">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default JobList;
