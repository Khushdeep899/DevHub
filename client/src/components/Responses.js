import React from 'react';
import ResponseCardFunc from './ResponseCard'; 
import './Responses.css'; 

const ResponseFunc = ({ replies }) => {
  return (
    <div className="response-list-container">
      {replies.map(reply => (
        <ResponseCardFunc key={reply.reply_id} reply={reply} />
      ))}
    </div>
  );
};

export default ResponseFunc;

