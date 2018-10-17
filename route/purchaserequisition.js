"use strict";
var express = require('express');
var router = express.Router();
var purchaseRequistionController = require('../controller/purchaserequisition');
var jwt = require('../config/jwt');

router.get('/', jwt, purchaseRequistionController.index);
router.post('/add', jwt,purchaseRequistionController.add);
router.delete('/delete', jwt, purchaseRequistionController.delete);
router.get('/permission/:id', jwt, purchaseRequistionController.get_permission);
router.post('/permission/save/:id', jwt, purchaseRequistionController.save_permission);

module.exports = router;