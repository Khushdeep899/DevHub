import React, { useState, useEffect } from 'react';
import TemplateFunc from '../components/Template';
import ChannelsFunc from '../components/Channels';
import NewChannelFunc from '../components/NewChannelForum';
import './Dashboard.css'; 

const DashboardFunc = () => {
  const [channels, setChannels] = useState([]);

  const fetchChannels = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/channels');
      if (!response.ok) {
        throw new Error('Failed to fetch channels');
      }
      const data = await response.json();
      setChannels(data);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };
  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <TemplateFunc>
      <div className="Dashboard-container">
      
        <aside className="channels-container">
        <ChannelsFunc channels={channels} onChannelsUpdated={fetchChannels} />
            </aside>
            <main className="NewChannel-container">
            <NewChannelFunc onChannelCreated={fetchChannels} />
            
            </main>

        </div>
      
    </TemplateFunc>
  );
};

export default DashboardFunc;
