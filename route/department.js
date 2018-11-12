"use strict";
var express = require('express');
var router = express.Router();
var departmentController = require('../controller/departments');
var jwt = require('../config/jwt');


router.get('/', departmentController.index);
router.post('/add', departmentController.add);
router.delete('/delete', departmentController.delete);
router.get('/edit/:id' ,jwt,  departmentController.getDepartmentDetails);
router.post('/edit/:id' ,jwt,  departmentController.edit);
router.get('/gethod/:id' ,jwt,  departmentController.getHod);
router.put('/update' ,jwt,  departmentController.update);

module.exports = router;