const express = require('express');
const router = express.Router();
const Controller = require('./MainController');

router.post('/message/:messageId', Controller.rateMessage);
router.post('/reply/:replyId', Controller.rateReply);
router.get('/:messageId', Controller.getMessageRating);
router.get('/reply/:replyId', Controller.getReplyRating);
module.exports = router;
