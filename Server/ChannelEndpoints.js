const express = require('express');
const router = express.Router();
const Controller = require('./MainController');


router.get('/', Controller.getAllChannels);


router.get('/:id', Controller.getChannelById);

router.post('/', Controller.createChannel);


router.put('/:id', Controller.updateChannel);

router.delete('/:id', Controller.deleteChannel);

module.exports = router;
