const Inventory = require("../model/inventory");
const mongoose = require("mongoose");
const User = mongoose.model("User");
// const PurchaseOrder = mongoose.model("PurchaseOrder");

exports.index = (req, res) => {
  Inventory.find({ isDeleted: false })
    .sort({ created: -1 })
    .populate("creator")
    .populate("requestor")
    .exec((err, doc) => {
      if (err)
        return res.status(500).send({
          success: false,
          message: "An unexpected error has occured while trying to fetch data"
        });
      return res.status(200).send({ success: true, doc });
    });
};

exports.submit = (req, res) => {
  const data = { ...req.body };
  const token = req.headers.authorization;
  const user = new User();
  const tokenz = user.getUser(token);
  data.created = new Date().toISOString();
  data.requestor = req.body.requestor; // Fetched from Purchase order
  data.creator = tokenz._id;

  const inventory = new Inventory(data);

  inventory
    .save()
    .then(doc => res.status(200).send({ success: true, doc }))
    .catch(err =>
      res.status(500).send({
        success: false,
        message: "Failed to save data, please fill required fields"
      })
    );
};

/**
 * @summary Soft Deletion of inventory
 */
exports.deleteOne = (req, res) => {
  const token = req.headers.authorization;
  const user = new User();
  const tokenz = user.getUser(token);

  User.findOne({ _id: tokenz._d }).exec((err, user) => {
    if (err)
      return res
        .status(500)
        .send({ success: false, message: `Failed to fetch user data` });
    if (user) {
      Inventory.findOneAndUpdate(
        { _id: req.body._id },
        { $set: { isDeleted: true } },
        { new: true }
      ).exec((err, doc) => {
        if (err)
          return res
            .status(500)
            .send({ success: false, message: "Failed to delete" });
        return res.status(200).send({ success: true, doc });
      });
    } else {
      return res
        .status(500)
        .send({ success: false, message: `Unable to perform action` });
    }
  });
};

exports.view = (req, res) => {
  if (!req.payload._id) {
    return res
      .status(401)
      .send({ success: false, message: "UnauthorizedError: private profile" });
  } else {
    User.findById({ _id: req.payload._id }).exec((err, doc) => {
      if (err)
        return res
          .status(404)
          .send({ success: false, message: `Invalid user` });
      return res.status(200).send({ success: true, doc });
    });
  }
};

exports.update = (req, res) => {
  const data = { ...req.body };
  Inventory.findOneAndUpdate(
    { _id: req.params.id },
    { $set: data },
    { new: true }
  ).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        success: false,
        message: "Something went wrong while fetching data"
      });
    return res.status(200).send({ success: true, doc });
  });
};
