


const express = require('express');
const router = express.Router();
const Controller = require('../controllers/Controller');


router.get('/content', Controller.searchContent);

router.get('/content/user/:username', Controller.searchContentByUser);
router.get('/user/posts',Controller.userWithMostOrLeastPosts);
router.get('/user/ranking', Controller.userWithHighestOrLowestRanking);


router.get('/messages/highestLikes', Controller.messagesByHighestLikes);
router.get('/messages/lowestLikes', Controller.messagesByLowestLikes);

module.exports = router;
