"use strict";
var express = require('express');
var router = express.Router();
var expenseHeaderController = require('../controller/expenseheader');
var jwt = require('../config/jwt');

router.get('/', expenseHeaderController.index);
router.post('/add', jwt, expenseHeaderController.add);

module.exports = router;