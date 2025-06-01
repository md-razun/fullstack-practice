import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <div className="home-page">
      <div className="card mb-4">
        <div className="card-body">
          <h1 className="text-center mb-4">Welcome to Fullstack Practice</h1>
          
          {isAuthenticated ? (
            <div className="text-center">
              <h2>Hello, {user.name}!</h2>
              <p className="mb-4">You are logged in. Check out your dashboard for more options.</p>
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">This is a fullstack application for practicing web development skills.</p>
              <div className="mb-3">
                <Link to="/login" className="btn btn-primary mr-3">Login</Link>
                <span style={{ margin: '0 10px' }}></span>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h3>Frontend</h3>
            </div>
            <div className="card-body">
              <p>Built with React, Redux, and React Router</p>
              <ul>
                <li>Component-based architecture</li>
                <li>State management with Redux</li>
                <li>Routing with React Router</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h3>Backend</h3>
            </div>
            <div className="card-body">
              <p>Powered by Node.js and Express</p>
              <ul>
                <li>RESTful API design</li>
                <li>JWT authentication</li>
                <li>MongoDB database integration</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h3>Features</h3>
            </div>
            <div className="card-body">
              <p>Key application features</p>
              <ul>
                <li>User authentication</li>
                <li>Profile management</li>
                <li>Data visualization</li>
                <li>Responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
