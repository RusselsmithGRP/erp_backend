"use strict";
var express = require('express');
var router = express.Router();
var vendorEvaluationController = require('../controller/vendorevaluation');
var jwt = require('../config/jwt');

router.get('/', jwt, vendorEvaluationController.index);
router.post('/add', jwt,vendorEvaluationController.add);
router.delete('/delete/:id', jwt, vendorEvaluationController.delete);
router.get('/view/:id', jwt,vendorEvaluationController.view);

module.exports = router;