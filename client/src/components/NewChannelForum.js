import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './NewChannelForum.css';

const NewChannelFunc = ({ onChannelCreated }) => {
  const { userId } = useContext(AuthContext);
  const [channelData, setChannelData] = useState({
    channel_name: '',
    description: '',
    user_id: userId,
  });

  const handleChange = (e) => {
    setChannelData({ ...channelData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/channels/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...channelData, user_id: userId }),
      });

      if (!response.ok) {
        throw new Error('Error creating channel');
      }

      setChannelData({ channel_name: '', description: '', user_id: userId });
      onChannelCreated();
    } catch (error) {
      console.error('Channel creation failed:', error);
    }
  };

  return (
    <div className="create-channel-container">
      <div className="overlay-create-channel">
        <form onSubmit={handleSubmit} className="form-container-create-channel">
          <h2 className="title-create-channel">Create New Channel</h2>
          <div className="input-group-create-channel">
            <label htmlFor="channel_name" className="form-label-create-channel">Channel Name</label>
            <input
              type="text"
              id="channel_name"
              name="channel_name"
              value={channelData.channel_name}
              onChange={handleChange}
              className="form-control-create-channel"
              placeholder="Enter channel name"
              required
            />
          </div>
          <div className="input-group-create-channel">
            <label htmlFor="description" className="form-label-create-channel">Description</label>
            <textarea
              id="description"
              name="description"
              value={channelData.description}
              onChange={handleChange}
              className="form-control-create-channel"
              placeholder="Enter channel description"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn-primary-create-channel">
            Create Channel
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewChannelFunc;
