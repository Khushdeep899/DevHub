import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TemplateFunc from '../components/Template';
import ChatLogFunc from '../components/ChatLog';
import NewChatFunc from '../components/NewChat';
import './ChannelInfo.css'; 






const ChannelInfoFunc = () => {
  const { channelId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const mockMessages = [
      { id: 1, content: 'Hello, this is a message in this channel.' },

    ];
    setMessages(mockMessages);
  }, [channelId]);

  const handlePostMessage = (messageContent) => {
    console.log('Posting message:', messageContent);
  };




  
  return (
    <TemplateFunc>
      <div className="channel-details-container">
        <div className="overlay">
          <div className="text-content-container">
            <h1 className="title">Channel:dsfdfdfd {channelId}</h1>
            <NewChatFunc onPostMessage={handlePostMessage} />
            <ChatLogFunc messages={messages} />
          </div>
        </div>
      </div>
    </TemplateFunc>
  );
};


export default ChannelInfoFunc;
