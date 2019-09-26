const express = require("express");
const router = express.Router();
const inventoryController = require("../controller/inventory");
const jwt = require("../config/jwt");

/**
 * @summary GET All Inventories
 */
router.get("/", jwt, inventoryController.index);

router.get("/view/:id", jwt, inventoryController.view);

router.post("/submit", jwt, inventoryController.submit);

router.put("/delete", jwt, inventoryController.deleteOne);

router.patch("/update/:id", jwt, inventoryController.update);

module.exports = router;
