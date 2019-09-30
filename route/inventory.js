const express = require("express");
const router = express.Router();
const inventoryController = require("../controller/inventory");
const jwt = require("../config/jwt");

/**
 * @summary GET All Inventories
 */
router.get("/", inventoryController.index);

router.get("/view/:id", inventoryController.view);

router.patch("/update/:id", inventoryController.update);

router.post("/create", inventoryController.create);

router.patch("/delete", jwt, inventoryController.deleteOne);

module.exports = router;
