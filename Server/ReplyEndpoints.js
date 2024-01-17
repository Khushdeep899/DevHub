const express = require('express');
const router = express.Router();
const Controller = require('./MainController');
module.exports = (upload) => {

router.get('/message/:messageId', Controller.getRepliesByMessage);
router.post('/message/:messageId', upload.single('image'), Controller.postReply);
router.put('/:replyId', Controller.updateReply);
router.delete('/:replyId', Controller.deleteReply);
return router;}
