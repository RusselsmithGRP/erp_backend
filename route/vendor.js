"use strict";
var express = require('express');
var router = express.Router();
var vendorController = require('../controller/vendors');

router.get('/', vendorController.index);
router.post('/', vendorController.create);
router.put('/', vendorController.update);
router.get('/:user_id', vendorController.view);

module.exports = router;