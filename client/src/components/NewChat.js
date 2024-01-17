import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';


import './NewChat.css'

const NewChatFunc = ({ channelId: selectedChannelId, onPostMessage: sendChatMessage }) => {
    const { userId } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('channelId', selectedChannelId);
        formData.append('userId', userId);
        formData.append('content', message);
        if (image) {
            formData.append('image', image);
        }

        sendChatMessage(formData);
        setMessage('');
        setImage(null);
    };

    return (
        <form onSubmit={handleSubmit} className="new-message-unique-form">
            <textarea
                className="new-message-unique-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
            ></textarea>
            <div className="new-message-unique-actions">
                <input
                    type="file"
                    className="new-message-unique-file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <button type="submit" className="new-message-unique-submit">
                    Post Message
                </button>
            </div>
        </form>
    );
};

export default NewChatFunc;
