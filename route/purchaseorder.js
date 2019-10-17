"use strict";
var express = require("express");
var router = express.Router();
var purchaseOrderController = require("../controller/purchaseorder");
var jwt = require("../config/jwt");

router.delete("/delete/:id", jwt, purchaseOrderController.deletePO);
router.get("/", jwt, purchaseOrderController.index);
router.post("/save", jwt, purchaseOrderController.save);
router.post("/submit", jwt, purchaseOrderController.submit);
router.post("/terms", jwt, purchaseOrderController.terms);
router.get("/view/:id", jwt, purchaseOrderController.view);
router.post("/update/:id", jwt, purchaseOrderController.update);
// router.get("/docs", jwt, purchaseOrderController.getDocs);
router.get("/allapproved", purchaseOrderController.findGeneralApprovedPO);

module.exports = router;
