const express = require('express');
const router = express.Router();
const Controller = require('./MainController');


router.post('/register', Controller.registerUser);

router.post('/signin', Controller.loginUser);

router.get('/', Controller.getAllUsers);

router.get('/:id', Controller.getUserById);

router.put('/:id', Controller.updateUser);

router.delete('/:id', Controller.deleteUser);

module.exports = router;
