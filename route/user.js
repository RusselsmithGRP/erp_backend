"use strict";
var express = require("express");
var router = express.Router();
var jwt = require("../config/jwt");
var userController = require("../controller/users");

router.get("/", jwt, userController.index);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/import", userController.importuser);
/**
 * @author Idowu
 * @method PATCH
 * @summary Changed method from put to patch
 */
router.patch("/updateprofiledata", userController.updateProfileData);
router.get("/view/:id", jwt, userController.view);
router.put("/requestresettoken", userController.requestResetToken);
router.put("/resetthepassword/:token", userController.resetThePassword);
router.put("/changeyourpassword/", userController.changeYourPassword);
router.get("/confirmtoken/:token", userController.confirmtoken);
router.get("/confirmregistration/:token", userController.confirmRegistration);
router.delete("/deleteuser/:data", userController.deleteUser);
router.get("/findallstaff", userController.findAllStaff);
router.get("/findonlystaff", userController.findOnlyStaff);
router.get("/findmanagers", userController.findManagers);
router.post("/createnewuser", userController.createNewUser);
router.get("/getprofiledetails/:id", userController.getProfileDetails);
/**
 * @author Idowu
 * @method PATCH
 * @summary Update User's Profile
 */
router.patch("/user", userController.updateUserProfile);

module.exports = router;
