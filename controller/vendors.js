var mongoose = require("mongoose");
var Vendor = mongoose.model("Vendor");
var mailer = require("../model/mailer");
var user_controller = require("./users");

exports.index = (req, res, next) => {
  Vendor.find()
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      else res.send(docs);
    });
};

exports.approved = (req, res, next) => {
  const query = { status: "APPROVED" };
  Vendor.find(query)
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      res.send(docs);
    });
};

exports.unapproved = (req, res, next) => {
  const query = { status: "UNAPPROVED" };
  Vendor.find(query)
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      res.send(docs);
    });
};

exports.pending = (req, res, next) => {
  const query = { status: "PENDING" };
  Vendor.find(query)
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      res.send(docs);
    });
};

exports.new = (req, res, next) => {
  const query = { status: "" };
  Vendor.find(query)
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      res.send(docs);
    });
};
exports.blacklisted = (req, res, next) => {
  const query = { status: "BLACKLISTED" };
  Vendor.find(query)
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      res.send(docs);
    });
};

exports.view = (req, res, next) => {
  Vendor.find({ user: req.params.user_id }).exec((err, doc) => {
    if (err) return next(err);
    res.send(doc);
  });
};

exports.viewOne = (req, res, next) => {
  Vendor.find({ _id: req.params.id }).exec((err, doc) => {
    if (err) return next(err);
    res.send(doc);
  });
};
exports.detailsByUserId = (req, res, next) => {
  Vendor.findOne({ user: req.params.id }).exec((err, doc) => {
    if (err) return next(err);
    res.send(doc);
  });
};

exports.search = (req, res, next) => {
  const regexValue = "^" + req.body.text;
  var queryOptions = req.body.text
    ? {
        "general_info.company_name": {
          $regex: regexValue,
          $options: "i"
        }
      }
    : {};
  Vendor.find(queryOptions).exec((err, doc) => {
    if (err) return next(err);
    res.send(doc);
  });
};

exports.update = (req, res, next) => {
  const data = req.body;
  // const key = data.key;
  // const value = data.value;
  // if ("business_info" in data.payload) {
  //   if (
  //     data.payload.business_info.product_related &&
  //     data.payload.business_info.service_related
  //   ) {
  //     data.payload["classes"] = 3;
  //   } else if (data.payload.business_info.product_related) {
  //     data.payload["classes"] = 1;
  //   } else if (data.payload.business_info.service_related) {
  //     data.payload["classes"] = 2;
  //   }
  // }
  // Vendor.updateOne({ [key]: value }, req.body.payload, (err, result) => {
  //   if (err) return next(err);
  //   res.send(result);
  // });
  Vendor.updateOne({ user: data.user }, data, (err, result) => {
    if (err) return next(err);
    res.send(result);
  });
};

exports.updateStatus = (req, res, next) => {
  const body = req.body;
  const key = body.key;
  const value = body.value;
  let data = body.response
    ? { status: value, response: body.response }
    : { status: value };
  Vendor.updateOne({ _id: key }, data, (err, result) => {
    if (err) return next(err);

    Vendor.find({ _id: key })
      .populate("user")
      .exec((err, doc) => {
        if (value === "APPROVED") {
          send_approval_email(req, res, next, doc[0]);
        } else if (value === "UPDATE") {
          send_unapproval_email(req, res, next, doc[0]);
        }
      });
    res.send(result);
  });
};

/**
 * @author Idowu
 * @summary Added a check using Vendor.find to see if newly
 * @summary created vendor already exists in the database
 */
exports.create = (req, res, next) => {
  const data = req.body;
  data.created = new Date();
  let vendor = new Vendor(data);
  Vendor.find({ _id: vendor.id }, { _id: 1 })
    .limit(1)
    .exec((err, doc) => {
      if (err) throw err;
      if (doc) {
        res.json({
          success: false,
          errMsg: "This user already exist, Try logging in."
        });
        return;
      } else {
        vendor.save(function(err, result) {
          if (err) {
            res.send({
              success: false,
              message: `This user already exist, Try logging in.`
            });
            return next(err);
          }
          // saved!
          res.send(result);
        });
      }
    });
};

// let send_approval_email = function(req, res, next, doc) {
//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: process.env.EMAIL_FROM, // sender address
//     to: doc.user._doc.email, //req.body.email, // list of receivers
//     bcc:
//       process.env.IAC_GROUP_EMAIL + "," + process.env.PROCUREMENT_GROUP_EMAIL,
//     subject: "Vendor Application Approved", // Subject line
//     text:
//       "Dear " +
//       doc.general_info.company_name +
//       "\nYour Vendor Application on the RusselSmith Vendor Management System has been approved. You can login to your account and use the full features of the system.\n For help, check out our Frequently Asked Questions page. \nRegards \nThe Russelsmith Team.", // plain text body
//     html:
//       "<p>Dear " +
//       doc.general_info.company_name +
//       "</p><br /><p>Your Vendor Application on the RusselSmith Vendor Management System has been approved. You can login to your account and use the full features of the system.</p><p>For help, check out our <u>Frequently Asked Questions page</u>.</p><br /><br /><p>Regards</p><p>The Russelsmith Team</p>" // html body
//   };
//   mailer.sendMail(mailOptions, res, next);
// };

const send_approval_email = (req, res, doc) => {
  const msg = {
    to: doc.user._doc.email,
    from: process.env.EMAIL_FROM,
    bcc: process.env.IAC_GROUP_EMAIL + "," + process.env.PROCUREMENT_EMAIL,
    subject: "Vendor Application Approved",
    templateId: process.env.VENDOR_APPROVAL_TEMPLATE_ID,
    dynamic_template_data: {
      subject: "Vendor Application Approved",
      company_name: doc.general_info.company_name,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  mailer.sendMailer(msg, req, res);
};

// let send_unapproval_email = function(req, res, next, doc) {
//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: process.env.EMAIL_FROM, // sender address
//     to: doc.user._doc.email, //req.body.email, // list of receivers
//     bcc: process.env.IAC_GROUP_EMAIL,
//     subject: "Vendor Application Modification Required", // Subject line
//     text:
//       "Dear " +
//       doc.general_info.company_name +
//       '\nYour Vendor Application was not accepted. Please see the comments below: "\n' +
//       req.body.message +
//       '". \nRegards \nThe Russelsmith Team.', // plain text body
//     html:
//       "<p>Dear " +
//       doc.general_info.company_name +
//       '</p><br /><p>Your Vendor Application was not accepted. Please see the comments below:</p><p> <b>"' +
//       req.body.message +
//       '"</p>.</p><br /><br /><p>Regards</p><p>The Russelsmith Team</p>' // html body
//   };
//   mailer.sendMail(mailOptions, res, next);
// };

const send_unapproval_email = (req, res, doc) => {
  const msg = {
    to: doc.user._doc.email,
    from: process.env.EMAIL_FROM,
    bcc: process.env.IAC_GROUP_EMAIL,
    subject: "Vendor Application Modification Required",
    templateId: process.env.VENDOR_UNAPPROVAL_TEMPLATE_ID,
    dynamic_template_data: {
      subject: "Vendor Application Modification Required",
      company_name: doc.general_info.company_name,
      comments: req.body.message,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };

  mailer.sendMailer(msg, req, res);
};

/**
 * @author Idowu
 * @summary Fixed delete vendor
 * @deprecated Do NOT uncomment user_controller.deleteUser -- Issue pending Resolution
 */
exports.deleteVendor = (req, res) => {
  Vendor.deleteOne({ user: req.body.user })
    .select()
    .exec(function(err, vendor) {
      userId = req.body.user;
      // user_controller.deleteUser(userId);
    });
};
