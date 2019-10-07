const express = require("express");
const router = express.Router();
const warehouseController = require("../controller/warehouse");

router.get("/", warehouseController.index);
router.patch("/update/:id", warehouseController.update);
router.delete("/delete/:id", warehouseController.delete);
router.post("/add", warehouseController.create);

module.exports = router;
