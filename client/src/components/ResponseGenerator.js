import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './ResponseGenerator.css';

const ResponseGeneratorFunc = ({ messageId, onPostReply }) => {
  const { userId } = useContext(AuthContext);
  const [replyText, setReplyText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', replyText);
    formData.append('userId', userId); 
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    onPostReply(messageId, formData);
    
    setReplyText('');
    setSelectedImage(null);
  };
  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleFormSubmit}
      className="new-reply-unique-form"
    >
      <textarea
        className="new-reply-unique-textarea"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write your reply..."
        required
      ></textarea>
      <input
        type="file"
        onChange={(e) => setSelectedImage(e.target.files[0])}
        className="new-reply-unique-input"
      />
      <button
        type="submit"
        className="new-reply-unique-button"
      >
        Post Reply
      </button>
    </form>
  );
};

export default ResponseGeneratorFunc;
