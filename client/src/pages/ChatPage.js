import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ChatLogFunc from '../components/ChatLog';
import NewChatFunc from '../components/NewChat';
import TemplateFunc from '../components/Template';
import SearchFunc from '../components/Search';

import './ChatPage.css'; 
import ChannelsFunc from '../components/Channels';
import SearchResults from './SearchResult'; 

const ChatPageFunc = () => {
  const { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [channels, setChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(false);

  const fetchChannelsData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/channels');
      if (!response.ok) {
        throw new Error('Failed to fetch channels');
      }
      const data = await response.json();
      setChannels(data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoadingChannels(false); 
    }
  }, []);

  useEffect(() => {
    fetchChannelsData();
  }, [fetchChannelsData]);

  const fetchMessagesData = useCallback(async () => {
    if (isSearchActive) return;
    setLoadingMessages(true);
    try {
      const response = await fetch(`http://localhost:3001/api/messages/channel/${channelId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setMessages(sortedData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  }, [channelId, isSearchActive]);

  useEffect(() => {
    fetchMessagesData();
  }, [channelId, fetchMessagesData]);

  const handlePostMessage = async (formData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/messages/channel/${channelId}/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to post message');
      }

      fetchMessagesData();
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const handleReturnToMessages = () => {
    setIsSearchActive(false);
  };

  const handleSearch = async (searchTerm, type) => {
    try {
      setIsSearchActive(true); 
      let url;
      if (type === 'content') {
        url = `http://localhost:3001/api/search/content?q=${encodeURIComponent(searchTerm)}`;
      } else if (type === 'user') {
        url = `http://localhost:3001/api/search/content/user/${encodeURIComponent(searchTerm)}`;
      } else if (type === 'highestLikes') {
        url = `http://localhost:3001/api/search/messages/highestLikes`;
      } else if (type === 'lowestLikes') {
        url = `http://localhost:3001/api/search/messages/lowestLikes`;
      } else {
        console.error('Unknown search type');
        return;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loadingMessages) {
    return <div>Loading messages...</div>;
  }

  return (
    <TemplateFunc>
      <div className="chat-page-container">
        <aside className="channel-list-container">
          <ChannelsFunc
            channels={channels}
            onChannelsUpdated={fetchChannelsData}
            currentChannelId={parseInt(channelId, 10)}
          />
        </aside>
        <div className="overlay-chat-page">
          <div className="text-content-container">
            <div className="search-and-results-unique">
              <SearchFunc onSearch={handleSearch} />
              {isSearchActive && (
                <>
                  <button onClick={handleReturnToMessages} className="return-button">Return to Previous Page</button>
                  <SearchResults results={searchResults} />
                </>
              )}
            </div>
            <p className="title-chat-page ">Post a Question here</p>
            <NewChatFunc channelId={channelId} onPostMessage={handlePostMessage} />
            {!isSearchActive && (
              <ChatLogFunc
                messages={messages}
              />
            )}
          </div>
        </div>
      </div>
    </TemplateFunc>
  );
};

export default ChatPageFunc;
