
import React, { useState, useContext, useEffect,useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ResponsesFunc from './Responses';
import ResponseGeneratorFunc from './ResponseGenerator';
import './MessageCard.css'


const MessageCardFunc = ({ message, onDelete }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [likes, setLikes] = useState(message.likes || 0); // Initialize likes from message data
    const [dislikes, setDislikes] = useState(message.dislikes || 0); // Initialize dislikes from message data
    const { userId } = useContext(AuthContext);
  

    const fetchLikesDislikes = useCallback(async () => {
      try {
          const response = await fetch(`http://localhost:3001/api/rating/${message.message_id}`);
          if (!response.ok) throw new Error('Failed to fetch rating');
          const { likes, dislikes } = await response.json();
          setLikes(likes);
          setDislikes(dislikes);
      } catch (error) {
          console.error('Error fetching rating:', error);
      }
  }, [message.message_id]); // Dependency for useCallback

  useEffect(() => {
    fetchLikesDislikes();
    if (showReplies) {
        fetchReplies(message.message_id);
    }
}, [showReplies, message.message_id, fetchLikesDislikes]);

const updateRating = async (isLike) => {
    try {
        const response = await fetch(`http://localhost:3001/api/rating/message/${message.message_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, isLike })
        });
        if (!response.ok) throw new Error('Failed to update rating');
        fetchLikesDislikes(); 
    } catch (error) {
        console.error('Error updating rating:', error);
    }
};

const handleLike = () => {
    setLikes(likes + 1);
    updateRating(true);
};

const handleDislike = () => {
    setDislikes(dislikes + 1); 
    updateRating(false);
};


  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const fetchReplies = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/replies/message/${messageId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch replies');
      }
      const repliesData = await response.json();
      setReplies(repliesData);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handlePostReply = async (messageId, formData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/replies/message/${messageId}`, {
        method: 'POST',
        body: formData 
      });
  
      if (!response.ok) {
        throw new Error('Failed to post reply');
      }
  
      fetchReplies(messageId); 
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };


  
  

  const handleDeleteMessage = async () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const response = await fetch(`http://localhost:3001/api/messages/${message.message_id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete the message');
        }

        onDelete(message.message_id);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const canDelete =( userId === 4 || userId === message.user_id );

  

  return (
    <div className="message-item-container">
    <div className="mb-4 animate__animated animate__fadeIn">
        <div className="card-messageitem">
            <div className="card-body">
                <h5 className="card-title">{message.username}</h5>
                <p className="card-text">{message.content}</p>
                {message.screenshot_url && (
                    <img src={`http://localhost:3001/${message.screenshot_url}`} alt="Message" className="img-fluid mt-2" />
                )}
                <div className="d-flex justify-content-start align-items-center">
                    <button onClick={handleLike} className="btn btn-light btn-sm mr-2">⬆️ {likes}</button>
                    <button onClick={handleDislike} className="btn btn-light btn-sm">⬇️{dislikes}</button>
                    {canDelete && (
                        <button onClick={handleDeleteMessage} className="btn btn-danger btn-sm ml-auto">Delete Message</button>
                    )}
                </div>
            </div>
            <div className="card-footer bg-transparent border-top-0">
                <button onClick={handleToggleReplies} className="btn btn-outline-info btn-sm">View Replies</button>
                {showReplies && (
                    <>
                        <ResponseGeneratorFunc messageId={message.message_id} onPostReply={handlePostReply} />
                        <ResponsesFunc replies={replies} />
                    </>
                )}
            </div>
        </div>
    </div>
    </div>
);
};
export default MessageCardFunc;
