import React from 'react';
import MessageCardFunc from './MessageCard';
import './ChatLog.css'

const ChatLogFunc = ({ messages, onDeleteMessage }) => {
    return (
        <div className="chat-messages-container">
            {messages.map(msg => (
                <MessageCardFunc
                    key={msg.message_id}
                    message={msg}
                    onDelete={onDeleteMessage}
                />
            ))}
        </div>
    );
};

export default ChatLogFunc;
