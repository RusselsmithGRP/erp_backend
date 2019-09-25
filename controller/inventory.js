const Inventory = require("../model/inventory");
const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.index = (req, res) => {
  Inventory.find({ isDeleted: false })
    .sort({ created: -1 })
    .populate("creator")
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

exports.deleteOne = (req, res) => {
  const token = req.headers.authorization;
  const user = new User();
  const tokenz = user.getUser(token);

  User.findOne({ _id: tokenz._d }).exec((err, user) => {
    if (err) res.status();
  });

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
};
