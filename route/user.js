"use strict";
var express = require('express');
var router = express.Router();
var jwt = require('../config/jwt');
var userController = require('../controller/users');

router.get('/', jwt , userController.index);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/view/:id', jwt , userController.view);


module.exports = router;