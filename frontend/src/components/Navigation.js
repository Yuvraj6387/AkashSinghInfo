import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { isAuthenticated, admin, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🏛️ Government Jobs
        </Link>

        <div className="navbar-nav">
          <Link to="/">Home</Link>
          {isAuthenticated && admin && (
            <>
              <span>Welcome, {admin.username}!</span>
              <Link to="/admin/dashboard">Admin Dashboard</Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <Link to="/admin/login">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
