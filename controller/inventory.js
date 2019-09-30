const Inventory = require("../model/inventory");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Utility = require("../commons/utility");
const mailer = require("./mailer");
const Department = mongoose.model("Department");

exports.index = (req, res) => {
  Inventory.find({ isDeleted: false })
    .sort({ created: -1 })
    .populate("custodian")
    .populate("department")
    .exec((err, doc) => {
      if (err)
        return res.status(500).send({
          success: false,
          message: "An unexpected error has occured while trying to fetch data"
        });
      return res.status(200).send({ success: true, doc });
    });
};

/**
 * @author Idowu
 * @summary Create Inventory and handle file upload
 * @summary Handle file using FormData and e.target.files[0] && e.target.files[0].name for the fileName
 * @example `
 *    const formData = new FormData();
 *    formData.append('file', this.state.photo);
 * `
 * @summary Then formData should be added to the inventory payload to be handled upon form submission.
 * @important the `file` option passed as the first argument
 * to formData.append() must correspond with the `file` property attached to req.files.[file]
 */

exports.create = (req, res) => {
  const data = { ...req.body };

  const newInventory = new Inventory(data);
  newInventory.department = data.department;
  Department.findById({ _id: data.department }).exec((err, dept) => {
    if (err) return err;

    if (req.files === null) {
      return res
        .status(400)
        .json({ success: false, msg: "No File Exists: Bad Request" });
    }
    const file = req.files.file;

    let newDate = new Date().toISOString();
    const assetCode = Utility.generateInvNo(
      dept.slug,
      data.category,
      data.assetType,
      newDate,
      newInventory._id.toString()
    );
    newInventory.assetCode = assetCode.toUpperCase();

    let absolutePath; // For Production Only
    let filePath;
    if (process.env.NODE_ENV === "production") {
      absolutePath = `${__dirname}/../../assets/${newInventory._id}__${file.name}`;
      filePath = `/assets/${newInventory._id}__${file.name}`;
    } else {
      absolutePath = `${__dirname}/../../erp_frontend/src/assets/uploads/${newInventory._id}__${file.name}`;
      filePath = `/assets/uploads/${newInventory._id}__${file.name}`;
    }

    file.mv(absolutePath, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      newInventory.photo.filePath = filePath;
      newInventory.photo.fileName = file.name;
      // console.log(department.slug);

      newInventory
        .save()
        .then(result => res.status(200).send({ success: true, result }))
        .catch(err =>
          res.status(500).send({
            success: false,
            message: "Internal server error. Failed to save data"
          })
        );
    });
  });
};

/**
 * @summary Soft Delete of inventory Item
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
  const file = req.files.file;
  data.updated = new Date().toISOString();

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
