"use strict";
var express = require('express');
var router = express.Router();
var roleController = require('../controller/roles');
var jwt = require('../config/jwt');

router.get('/', jwt, roleController.index);
router.post('/add', jwt,roleController.add);
router.delete('/delete', jwt, roleController.delete);
router.get('/permission/:id', jwt, roleController.get_permission);
router.post('/permission/save/:id', jwt, roleController.save_permission);

module.exports = router;