const InventoryRequisition = require("../model/inventoryrequisition");
const Inventory = require("../model/inventory");
var Utility = require("../commons/utility");

exports.index = (req, res) => {
  InventoryRequisition.find()
    .populate("department")
    .exec((err, result) => {
      if (err)
        return res.status(400).send({
          success: false,
          message: "Bad Request: Failed to load resource"
        });
      return res.status(200).send({ success: true, result });
    });
};

exports.save = (req, res) => {
  const data = { ...req.body };
  let inventoryrequisition = new InventoryRequisition(data);
  inventoryrequisition
    .save()
    .then(result => res.status(200).send({ success: true, result }))
    .catch(err =>
      res.status(500).send({
        success: false,
        message: "Internal Server Error: Failed to save data"
      })
    );
};

/**
 * @author Idowu
 */
exports.submit = (req, res) => {
  const data = { ...req.body };
  const inventoryrequisition = new InventoryRequisition(data);
  inventoryrequisition
    .save()
    .then(result => {
      const prefix = "INV/REQ";
      const requisitionno = Utility.generateReqNo(
        prefix,
        data.departmentslug,
        result._id
      );
      inventoryrequisition.updateOne(
        { requisitionno: requisitionno.toUpperCase() },
        (err, doc) => {
          if (err)
            // Inventory.findOneAndUpdate({ _id: data.inventoryId })

            return res
              .status(400)
              .send({ success: false, message: "Failed to save data" });
          return res.status(200).send({ success: true, doc });
        }
      );
    })
    .catch(err =>
      res.status(500).send({
        success: false,
        message: "Internal Server Error: Failed to save data"
      })
    );
};

exports.update = (req, res) => {
  const data = { ...req.body };
  InventoryRequisition.findOneAndUpdate(
    { _id: req.params.id },
    { $set: data },
    { new: true }
  )
    .populate("department")
    .exec((err, result) => {
      if (err)
        return res.send({
          success: false,
          message: "Failed to update data. Reload and try again."
        });
      return res.send({ success: true, result });
    });
};

exports.view = (req, res) => {
  InventoryRequisition.findById({ _id: req.params.id }, (err, doc) => {
    if (err)
      return res
        .status(400)
        .send({ success: false, message: "Failed to load resource" });
    return res.status(200).send({ success: true, doc });
  });
};
