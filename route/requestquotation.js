"use strict";
var express = require('express');
var router = express.Router();
var requestQuotationController = require('../controller/requestquotation');
var jwt = require('../config/jwt');

router.get('/', jwt, requestQuotationController.index);
router.post('/save', jwt, requestQuotationController.save);
router.post('/submit', jwt, requestQuotationController.submit);
router.get('/index/:req', jwt, requestQuotationController.view);
router.get('/view/:id', jwt, requestQuotationController.view);
router.post('/update/:id', jwt, requestQuotationController.update);
/* router.delete('/delete', jwt, requestQuotationController.delete);
router.get('/permission/:id', jwt, requestQuotationController.get_permission);
router.post('/permission/save/:id', jwt, requestQuotationController.save_permission);
 */
module.exports = router;