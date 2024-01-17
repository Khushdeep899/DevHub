import React from 'react';
import { Link } from 'react-router-dom';
import './LandinPage.css'; 

const LandingPageFunc = () => {
  return (
    <div className="LandingPage-container">
      <div className="overlay-LandingPage">
        <div className="text-content-container">
          <div className="text-content animate__animated animate__fadeIn">
            <h1 className="display-4 font-weight-bold text-white mb-3">Connect and Collaborate</h1>
            <p className="lead text-white mb-4">
              Join our vibrant community of programmers. Share knowledge, solve coding puzzles, and enhance your skills with real-time discussions.
            </p>
            <div className="action-buttons">
              <Link to="/signin" className="btn btn-primary btn-lg mx-2 my-1 animate__animated animate__pulse animate__infinite">Sign In</Link>
              <Link to="/register" className="btn btn-success btn-lg mx-2 my-1">Register Now</Link>
            </div>
          </div>
        </div>

        <div className="features-section text-center">
          <h2 className="font-weight-bold mb-3">Features</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <i className="fa fa-comments fa-3x mb-2" aria-hidden="true"></i>
              <h3>Live Chat</h3>
              <p>Instantly connect with others and exchange ideas in real time.</p>
            </div>
            <div className="col-md-4 mb-4">
              <i className="fa fa-code fa-3x mb-2" aria-hidden="true"></i>
              <h3>Code Collaboration</h3>
              <p>Work on problems together with collaborative code editors.</p>
            </div>
            <div className="col-md-4 mb-4">
              <i className="fa fa-users fa-3x mb-2" aria-hidden="true"></i>
              <h3>Community Support</h3>
              <p>Get support and feedback from a friendly and knowledgeable community.</p>
            </div>
          </div>
        </div>
        

        <div className="cta-section text-center">
          <h2 className="font-weight-bold mb-3">Ready to get started?</h2>
          <p className="mb-4">Join our community and start enhancing your coding skills today.</p>
          <Link to="/register" className="btn btn-lg btn-warning">Join Now</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPageFunc;
