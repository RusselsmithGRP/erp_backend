const Movement = require("../model/movementlog");
const InventoryRequisition = require("../model/inventoryrequisition");
const Utility = require("../commons/utility");

exports.index = (req, res) => {
  Movement.find({})
    .sort({ created: -1 })
    .populate("requestor")
    .exec((err, result) => {
      if (err)
        return res.status(500).send({
          success: false,
          message: `Internal server error: reload and try again.`
        });
      return res.status(200).send({ success: true, result });
    });
};

exports.view = (req, res) => {
  InventoryRequisition.findById({ _id: req.params.id })
    .populate("requestor")
    .exec((err, result) => {
      if (err)
        return res.send({
          success: false,
          message: "Failed to load resource."
        });
      return res.send({ success: true, result });
    });
};

exports.save = (req, res) => {
  const data = { ...req.body };
  const movementlog = new Movement(data);
  movementlog
    .save()
    .then(result => res.send({ success: true, result }))
    .catch(err =>
      res.send({
        success: false,
        message: "Failed to save data. Reload and try again."
      })
    );
};

exports.submit = (req, res) => {};
