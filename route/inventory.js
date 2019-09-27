const express = require("express");
const router = express.Router();
const inventoryController = require("../controller/inventory");
const jwt = require("../config/jwt");

/**
 * @summary GET All Inventories
 */
router.get("/", inventoryController.index);

router.get("/view/:id", inventoryController.view);

router.patch("/delete", inventoryController.deleteOne);

router.patch("/update/:id", inventoryController.update);

router.post("/create", inventoryController.create);
module.exports = router;
