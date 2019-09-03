"use strict";
var express = require("express");
var router = express.Router();
var receivingAndInspectionController = require("../controller/receivingandinspection");
var jwt = require("../config/jwt");

router.get("/", jwt, receivingAndInspectionController.index);
router.get(
  "/all/work/completion",
  jwt,
  receivingAndInspectionController.allWorkCompletion
);
router.post("/submit", jwt, receivingAndInspectionController.submit);
router.post(
  "/submitworkcompletion",
  jwt,
  receivingAndInspectionController.submitWorkCompletion
);
router.get(
  "/getinspectedproduct/:id",
  jwt,
  receivingAndInspectionController.getinspectedproduct
);
router.put("/update/:id", jwt, receivingAndInspectionController.update);
router.put(
  "/updateworkcompletion/:id",
  jwt,
  receivingAndInspectionController.updateWorkCompletion
);
router.get(
  "/getissuedworkcompletion/:id",
  jwt,
  receivingAndInspectionController.getIssuedWorkCompletion
);
router.post(
  "/submitrejectionlog",
  jwt,
  receivingAndInspectionController.submitRejectionLog
);
router.get(
  "/allrejectionlogs/",
  jwt,
  receivingAndInspectionController.allRejectionLogs
);
router.get(
  "/getrejectionlog/:id",
  jwt,
  receivingAndInspectionController.getRejectionLog
);

module.exports = router;
