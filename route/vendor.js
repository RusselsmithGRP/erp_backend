"use strict";
var express = require('express');
var router = express.Router();
var jwt = require('../config/jwt');
var vendorController = require('../controller/vendors');

router.get('/', vendorController.index);
router.post('/', vendorController.create);
router.put('/', vendorController.update);
router.get('/approved', vendorController.approved);
router.get('/pending', vendorController.pending);
router.get('/blacklisted', vendorController.blacklisted);
router.get('/new', vendorController.new);
router.get('/unapproved', vendorController.unapproved);
router.put('/updatestatus', vendorController.updateStatus);
router.get('/search' , vendorController.search);
router.get('/:user_id', vendorController.view);
router.get('/one/:id', vendorController.viewOne);
router.delete('/deletevendor', jwt , vendorController.deleteVendor);

module.exports = router;