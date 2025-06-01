import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page text-center">
      <div className="card">
        <div className="card-body">
          <h1 className="display-1">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-4">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <Link to="/" className="btn btn-primary">Go to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
