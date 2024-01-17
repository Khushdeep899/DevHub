import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './SignIn.css'; 

const SignInComponent = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newError, setNewError] = useState('');
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    setNewError('');
    try {
      const response = await fetch('http://localhost:3001/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { token, userId, userName } = await response.json();
      signIn(token, userId, userName);
      navigate('/channels');
    } catch (error) {
      setNewError(error.message);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-overlay">
        <h2 className="signin-title">Sign In</h2>
        <form onSubmit={handleNewSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="newUsername" className="form-label">Username</label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button className="signin-button" type="submit">
            Sign In
          </button>
          <Link to="/register" className="register-link">
            New Here?
          </Link>
        </form>
        {newError && <p className="error-message">{newError}</p>}
      </div>
    </div>
  );
};

export default SignInComponent;
