import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <h1 className="text-center mb-4">About This Project</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2>Project Overview</h2>
          <p>
            This fullstack practice project is designed to demonstrate a complete web application
            with both frontend and backend components. It serves as a learning platform for
            developers to understand how different technologies work together in a modern web
            application.
          </p>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2>Technology Stack</h2>
          
          <h3 className="mt-3">Frontend</h3>
          <ul>
            <li><strong>React:</strong> A JavaScript library for building user interfaces</li>
            <li><strong>Redux:</strong> A predictable state container for JavaScript apps</li>
            <li><strong>React Router:</strong> Declarative routing for React applications</li>
            <li><strong>Axios:</strong> Promise-based HTTP client for making API requests</li>
          </ul>
          
          <h3 className="mt-3">Backend</h3>
          <ul>
            <li><strong>Node.js:</strong> JavaScript runtime built on Chrome's V8 JavaScript engine</li>
            <li><strong>Express:</strong> Fast, unopinionated, minimalist web framework for Node.js</li>
            <li><strong>MongoDB:</strong> NoSQL database for modern applications</li>
            <li><strong>Mongoose:</strong> MongoDB object modeling for Node.js</li>
            <li><strong>JWT:</strong> JSON Web Tokens for secure authentication</li>
          </ul>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2>Features</h2>
          <ul>
            <li>User authentication (register, login, logout)</li>
            <li>Protected routes for authenticated users</li>
            <li>User profile management</li>
            <li>Responsive design for all device sizes</li>
            <li>State management with Redux</li>
            <li>RESTful API endpoints</li>
          </ul>
        </div>
      </div>
      
      <div className="card">
        <div className="card-body">
          <h2>Learning Goals</h2>
          <p>
            This project aims to help developers understand:
          </p>
          <ul>
            <li>How to structure a fullstack application</li>
            <li>Client-server communication</li>
            <li>State management in frontend applications</li>
            <li>Authentication and authorization</li>
            <li>Database operations and modeling</li>
            <li>Deployment and production considerations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
