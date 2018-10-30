"use strict";
var express = require('express');
var router = express.Router();
var departmentController = require('../controller/departments');
var jwt = require('../config/jwt');


router.get('/', departmentController.index);
router.post('/add', departmentController.add);
router.delete('/delete', departmentController.delete);
router.get('/edit/:id' ,jwt,  departmentController.getDepartmentDetails);

module.exports = router;