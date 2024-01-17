import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Channels.css'; 

const ChannelsFunc = ({ channels, onChannelsUpdated, currentChannelId }) => {
  const { userId, userName } = useContext(AuthContext);
  const [filterText, setFilterText] = useState('');

  const channelsToShow = channels.filter(channel =>
    channel.channel_name.toLowerCase().includes(filterText.toLowerCase())
  );

  const confirmAndDelete = async (channelId) => {
    if (window.confirm("Do you really wish to remove this channel?")) {
      try {
        const response = await fetch(`http://localhost:3001/api/channels/${channelId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Channel deletion failed');
        }

        onChannelsUpdated();
      } catch (error) {
        console.error('Deletion error:', error);
      }
    }
  };

  const isDeletable = userName === 'Khusdeep' || userName === 'khusdeep'; //hard coding

  return (
    <div className="channel-list-container">
      <h2 className="channel-heading">Channel Directory</h2>
      <div className="channel-search">
        <input
          type="text"
          placeholder="Find channels..."
          onChange={(e) => setFilterText(e.target.value)}
          className="channel-search-input"
        />
      </div>
      <ul className="channel-list">
        {channelsToShow.map((channel) => (
          <li 
            key={channel.channel_id} 
            className={`channel-item ${channel.channel_id === currentChannelId ? 'active' : ''}`}
          >
            <div className="channel-info">
              <Link to={`/channels/${channel.channel_id}/messages`} className="channel-name">
                {channel.channel_name}
              </Link>
              <div className="channel-details">
                <p className="channel-description">{channel.description}</p>
                <p className="creator-info">Creator: {channel.username}</p>
              </div>
            </div>
            {isDeletable && (
              <button
                onClick={() => confirmAndDelete(channel.channel_id)}
                className="channel-delete-button"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelsFunc;
