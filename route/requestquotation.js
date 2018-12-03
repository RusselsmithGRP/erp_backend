"use strict";
var express = require('express');
var router = express.Router(); 
var requestQuotationController = require('../controller/requestquotation');
var jwt = require('../config/jwt');

router.get('/', jwt, requestQuotationController.index);
router.post('/submit', jwt, requestQuotationController.submit);
router.get('/index/:req', jwt, requestQuotationController.list);
router.get('/view/:id', jwt, requestQuotationController.view);
router.post('/update/:id', jwt, requestQuotationController.update);
router.post('/submitvendorquote', jwt, requestQuotationController.submitVendorQuote);
router.post('/accept_qoute', jwt, requestQuotationController.acceptQoute);
router.get('/vendor/:vendorId', jwt, requestQuotationController.vendorsQuoteList);
router.get('/unique_vendor', jwt , requestQuotationController.uniqueVendorListFromRespondedQuotes)
router.get('/quotes_for_vendor/:vendorId', jwt, requestQuotationController.allRepliedQuoteFomVendor);
/* router.delete('/delete', jwt, requestQuotationController.delete);
router.get('/permission/:id', jwt, requestQuotationController.get_permission);
router.post('/permission/save/:id', jwt, requestQuotationController.save_permission);
 */
module.exports = router;