import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../store/reducers/userReducer';

const Dashboard = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { users, loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Fetch users data
    dispatch(fetchUsers());
  }, [isAuthenticated, navigate, dispatch]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="dashboard-page">
      <h1 className="text-center mb-4">Dashboard</h1>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2>Welcome, {user?.name || 'User'}!</h2>
        </div>
        <div className="card-body">
          <p>This is your personal dashboard where you can manage your account and view data.</p>
          
          <div className="user-info mt-4">
            <h3>Your Profile</h3>
            <div className="card">
              <div className="card-body">
                <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>Account Status:</strong> <span className="badge bg-success">Active</span></p>
                <button className="btn btn-primary mt-3">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>User Management</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : (
            <>
              <p>Here's a list of users in the system:</p>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <button className="btn btn-sm btn-info me-2">View</button>
                          <button className="btn btn-sm btn-warning">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
