"use strict";
var express = require('express');
var router = express.Router();
var jwt = require('../config/jwt');
var userController = require('../controller/users');

router.get('/', jwt , userController.index);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.put('/updateprofiledata', userController.updateProfileData);
router.get('/view/:id', jwt , userController.view);
router.put('/requestresettoken' , userController.requestResetToken);
router.put('/resetthepassword/:token' , userController.resetThePassword);
router.put('/changeyourpassword/' , userController.changeYourPassword);
router.get('/confirmtoken/:token' , userController.confirmtoken);
router.delete('/deleteuser/:data' , userController.deleteUser);
router.get('/findallstaff' , userController.findAllStaff);
router.post('/createnewuser' , userController.createNewUser);
router.get('/getprofiledetails/:id' , userController.getProfileDetails);


module.exports = router;