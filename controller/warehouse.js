const Warehouse = require("../model/warehouse");

exports.index = (req, res) => {
  Warehouse.find()
    .sort({ created: -1 })
    .exec((err, doc) => {
      if (err)
        return res.status(500).send({
          success: false,
          message: "Internal Server error, please reload and try again."
        });
      return res.status(200).send({ success: true, doc });
    });
};

exports.delete = (req, res) => {
  Warehouse.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
    if (err)
      return res.status(500).send({
        success: false,
        message: "Failed to delete resource, reload and try again."
      });
    return res.send({ success: true, doc });
  });
};

exports.update = (req, res) => {
  const data = { ...req.body };
  Warehouse.findOneAndUpdate(
    { _id: req.params.id },
    { $set: data },
    { new: true }
  ).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        success: false,
        message: `Internal Server error: Failed to update data, please try again.`
      });
    return res.send({ success: true, doc });
  });
};

exports.create = (req, res) => {
  const data = { ...req.body };
  const warehouse = new Warehouse(data);
  warehouse
    .save()
    .then(doc => res.send({ success: true, doc }))
    .catch(err =>
      res.send({
        success: false,
        message: "Failed to save data, please reload and try again."
      })
    );
};
