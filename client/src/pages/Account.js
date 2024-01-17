import React, { useContext, useEffect, useState } from 'react';
import TemplateFunc from '../components/Template';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Account.css'; 

const AccountFunc = () => {
  const { userId } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleCloseProfile = () => {
    navigate(-1);
  };

  return (
    <TemplateFunc>
      <div className="user-profile-container">
        <div className="user-profile-card">
          <h1 className="user-profile-title">Your Profile</h1>
          <form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={userData.username}
                className="form-input"
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={userData.email}
                className="form-input"
                readOnly
              />
            </div>
          </form>
          <div className="mt-4">
            <button
              onClick={handleCloseProfile}
              className="user-profile-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </TemplateFunc>
  );
};

export default AccountFunc;
