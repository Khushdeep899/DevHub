import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signOut, userName } = useContext(AuthContext);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const outsideClickHandler = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', outsideClickHandler);
    return () => {
      document.removeEventListener('mousedown', outsideClickHandler);
    };
  }, []);

  const logoutUser = () => {
    signOut();
    navigate('/signin');
  };

  const toggleProfileDropdown = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-items">
          {isAuthenticated ? (
            <>
              <li><Link to="/channels" className="navbar-link">Dashboard</Link></li>
              {userName.toLowerCase() === 'khusdeep' && (
                <li><Link to="/Admin" className="navbar-link">Admin</Link></li>
              )}
            </>
          ) : (
            console.log('d')
          )}
        </ul>
        {isAuthenticated && (
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <button onClick={toggleProfileDropdown} className="profile-menu-trigger">
              {userName} 
            </button>
            {isProfileMenuOpen && (
              <div className="profile-dropdown">
                <Link to="/account" className="profile-dropdown-item">Account</Link>
                <button onClick={logoutUser} className="profile-dropdown-item">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
