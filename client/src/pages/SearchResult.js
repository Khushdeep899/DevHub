import React from 'react';
import MessageCardFunc from '../components/MessageCard';

const SearchResults = ({ results, onReturn }) => {

  const handleDeleteMessage = (messageId) => {
    console.log('Delete message', messageId);
  
  };
  const handlePostReply = (messageId, formData) => {
    console.log('Post reply for message', messageId);

  };

  return (
    <div className="search-results-overlay">
      <div className="search-results-container">
       
        {results.map((item) => (
          <MessageCardFunc 
            key={item.message_id}
            message={item}
            onDelete={handleDeleteMessage}
            onPostReply={handlePostReply}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
