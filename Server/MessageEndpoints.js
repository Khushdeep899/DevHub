const express = require('express');
const router = express.Router();
const Controller = require('./MainController');

module.exports = (upload) => {
    router.get('/channel/:channelId', Controller.getMessagesInChannel);
    router.get('/:messageId', Controller.getMessageById);
    router.post('/channel/:channelId', upload.single('image'), Controller.postMessage);
    router.put('/:messageId', Controller.updateMessage);
    router.delete('/:messageId', Controller.deleteMessage);

    return router;
};
