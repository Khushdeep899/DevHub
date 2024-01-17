import React, { useState, useContext, useCallback, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './ResponseCard.css'; 

const ResponseCardFunc = ({ reply }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const { userId } = useContext(AuthContext);

  const fetchInitialRating = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/rating/reply/${reply.reply_id}?messageId=${reply.message_id}`);
      if (!response.ok) throw new Error('Failed to fetch initial rating');
      const { likes, dislikes } = await response.json();
      setLikes(likes);
      setDislikes(dislikes);
    } catch (error) {
      console.error('Error fetching initial rating:', error);
    }
  }, [reply.reply_id, reply.message_id]);

  useEffect(() => {
    fetchInitialRating();
  }, [fetchInitialRating]);

  const updateRating = async (isLike) => {
    try {
      const response = await fetch(`http://localhost:3001/api/rating/reply/${reply.reply_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isLike, message_id: reply.message_id })
      });
      if (!response.ok) throw new Error('Failed to update rating');
      fetchInitialRating(); // Refetch rating after update
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleLike = () => {
    setLikes(likes + 1); // Optimistic update
    updateRating(true);
  };

  const handleDislike = () => {
    setDislikes(dislikes + 1); // Optimistic update
    updateRating(false);
  };

  return (
    <div className="reply-item-unique">
      <div className="reply-item-unique-content">
        <p className="reply-item-unique-username">User: {reply.username}</p>
        <p>{reply.content}</p>
        {reply.image_url && (
          <img src={`http://localhost:3001/${reply.image_url}`} alt="Reply" className="reply-item-unique-img" />
        )}
        <div className="reply-item-unique-rating">
          <button onClick={handleLike} className="reply-item-unique-button">⬆️ {likes}</button>
          <button onClick={handleDislike} className="reply-item-unique-button">⬇️ {dislikes}</button>
        </div>
      </div>
    </div>
  );
};

export default ResponseCardFunc;
