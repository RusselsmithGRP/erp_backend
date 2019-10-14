const express = require("express");
const router = express.Router();
const jwt = require("../config/jwt");
const inventoryController = require("../controller/inventoryrequisition");

router.get("/", jwt, inventoryController.index);

router.post("/save", jwt, inventoryController.save);

router.post("/submit", jwt, inventoryController.submit);

router.get("/view/:id", jwt, inventoryController.view);

router.patch("/update/:id", jwt, inventoryController.update);

module.exports = router;
