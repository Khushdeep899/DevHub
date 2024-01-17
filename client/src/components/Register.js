import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const RegisterComponent = () => {
  const [newUser, setNewUser] = useState({ username: '', password: '', email: '' });
  const [registrationError, setRegistrationError] = useState('');
  const navigation = useNavigate();

  const handleInputChange = (event) => {
    setNewUser({ ...newUser, [event.target.name]: event.target.value });
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    setRegistrationError('');
    try {
      const response = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Registration process failed');
      }
  
      const registrationResult = await response.json();

      navigation('/signin');
    } catch (error) {
      setRegistrationError(error.message);
    }
  };
  
  return (
    <div className="registration-container">
      <div className="registration-overlay">
        <div className="registration-content">
          <h2 className="registration-title">Create New Account</h2>
          <form onSubmit={handleRegistration} className="registration-form">
            <div className="input-group">
              <input
                type="text"
                id="username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
                className="input-field"
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="input-field"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                id="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="input-field"
              />
            </div>
            <button type="submit" className="submit-button">
              Sign Up
            </button>
            <div className="login-redirect">
              <Link to="/signin" className="redirect-link">
                Already registered? Log In
              </Link>
            </div>
          </form>
          {registrationError && <p className="error-message">{registrationError}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
