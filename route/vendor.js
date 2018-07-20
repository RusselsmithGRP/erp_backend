"use strict";
var express = require('express');
var router = express.Router();
var vendorController = require('../controller/vendors');

router.get('/', vendorController.index);
router.post('/', vendorController.create);
router.put('/', vendorController.update);
router.get('/approved', vendorController.approved);
router.get('/pending', vendorController.pending);
router.get('/blacklisted', vendorController.blacklisted);
router.put('/updatestatus', vendorController.updateStatus);
router.get('/:user_id', vendorController.view);
router.get('/one/:id', vendorController.viewOne);

module.exports = router;