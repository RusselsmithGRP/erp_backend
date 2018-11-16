"use strict";
var express = require('express');
var router = express.Router();
var locationController = require('../controller/locations');
var jwt = require('../config/jwt');

router.get('/', jwt, locationController.index);
router.post('/add', jwt, locationController.add);
router.delete('/delete', jwt, locationController.delete);
router.get('/getlocation' , locationController.getLocation);
router.post('/getaddress' , locationController.getAddress);


module.exports = router;