"use strict";
var express = require('express');
var router = express.Router();
var departmentController = require('../controller/departments');

router.get('/', departmentController.index);
router.post('/add', departmentController.add);
router.delete('/delete', departmentController.delete);

module.exports = router;