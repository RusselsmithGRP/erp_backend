var mongoose = require("mongoose");
var PurchaseRequisition = mongoose.model("PurchaseRequisition");
var Department = mongoose.model("Department");
const Vendor = mongoose.model("Vendor");
var Utility = require("../commons/utility");
var User = mongoose.model("User");
var mailer = require("../model/mailer");
var Status = require("../commons/Status");

exports.index = (req, res, next) => {
  const token = req.headers.authorization;
  var user = new User();
  const tokenz = user.getUser(token);
  if (tokenz.role === "procurement") {
    PurchaseRequisition.find()
      .populate("requestor department")
      .sort({ created: -1 })
      .exec((err, docs) => {
        if (err) return next(err.message);
        else res.send(docs);
      });
  } else {
    const option = tokenz.department
      ? { department: tokenz.department._id }
      : {};
    PurchaseRequisition.find(option)
      .populate("requestor department")
      .sort({ created: -1 })
      .exec((err, docs) => {
        if (err) return next(err);
        else res.send(docs);
      });
  }
};

exports.save = (req, res, next) => {
  const data = req.body;
  data.created = new Date();
  let purchaserequisition = new PurchaseRequistion(data);
  purchaserequisition.save(function(err, result) {
    if (err) return next(err);
    // saved!
    res.send(result);
  });
};

/**
 * @author Idowu
 * @summary User.findOne was added to get requestor details
 */
exports.submit = (req, res, next) => {
  const data = { ...req.body };
  data.dateneeded = data.dateneeded;
  data.justification = data.justification;
  data.vendor = (data.vendor) ?  data.vendor: null;
  data.created = new Date();
  let purchaserequisition = new PurchaseRequisition(data);
  purchaserequisition.save((err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        msg: err.message
      });
      return next(err);
    }
    const prefix = "REQ";
    // saved!
    const requisitionNo = Utility.generateReqNo(
      prefix,
      data.departmentslug,
      result.id
    );
    PurchaseRequisition.findByIdAndUpdate(
      { _id: result.id },
      { $set: { requisitionno: requisitionNo.toUpperCase() } },
      { new: true }
    ).exec((err, r) => {
      // if (err) return next(err);
      Department.findById({ _id: r.department })
        .populate("hod")
        .exec((err, dept) => {
          // if (err) return next(err);
          User.findOne({ _id: r.requestor }).exec((err, doc) => {
            let requestor = doc.email;
            // console.log({ dept });
            send_new_requisition_email(
              {
                id: r.id,
                dept,
                requisitionNo: requisitionNo.toUpperCase(),
                requestor
              },
              req,
              res
            );
          });
        });
      res.send(result);
    });
  });
 };

// let send_new_requisition_email = function(options, req, res, next) {
//   const { id, dept } = options;
//   // setup email data with unicode symbols
//   const request_link = Utility.generateLink("/requisition/view/", id);
//   let mailOptions = {
//     from: process.env.EMAIL_FROM, // sender address
//     to: dept.hod.email,
//     //bcc: process.env.IAC_GROUP_EMAIL,
//     subject: "New Purchase Request Submitted", // Subject line
//     text:
//       "A purchase requisition has been submitted for your review and approval.\n To view, please click the link below: Link: " +
//       request_link +
//       " \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.", // plain text body
//     html:
//       '<p>A purchase requisition has been submitted for your review and approval.</p><p> To view, please click the link below: Link: <a href="' +
//       request_link +
//       '">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>' // plain text body
//   };
//   mailer.sendMail(mailOptions, res, next);
//   // console.log(mailOptions);
//   next();
// };

/**
 * @author Idowu
 * @param {*} options Object parameters passed to the function call
 * @param {*} req Request for payload or resource from a server.
 * @param {*} res Returns a response from a server
 * @param {*} next Express middleware function to either terminate or make a middleware available
 * to the next middleware/function for use
 */
const send_new_requisition_email = (options, req, res) => {
  const { id, dept, requisitionNo, requestor } = options;
  // Set email data with unicode symbols
  const request_link = Utility.generateLink("/requisition/view/", id);
  const msg = {
    to: dept.hod.email,
    from: process.env.EMAIL_FROM,
    subject: `New Purchase request submitted`,
    templateId: process.env.PURCHASE_REG_TEMPLATE_ID,
    dynamic_template_data: {
      subject: `New Purchase request submitted`,
      request_link: request_link,
      requisitionNo: requisitionNo,
      requestor: requestor,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  mailer.sendMailer(msg, req, res);
};

// let sendApprovalEmail = function(req, res, next) {
//   const request_link = Utility.generateLink("/requisition/view/", req.id);
//   // const status = Status.getStatus(req.status);
//   const status = Status.getStatus(res.status);
//   const reason = req.reason ? req.reason : "";

//   let mailOptions = {
//     from: process.env.EMAIL_FROM, // sender address
//     to: req.requestor.email,
//     //bcc: process.env.IAC_GROUP_EMAIL,
//     subject: status + " " + req.requisitionno, // Subject line
//     text:
//       status +
//       " Purchase requisition with No: " +
//       req.requisitionno +
//       " .\n Reason .\n" +
//       reason +
//       " \n To view, please click the link below: Link: " +
//       request_link +
//       " \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.", // plain text body
//     html:
//       "<p>" +
//       status +
//       " Purchase requisition with No " +
//       req.requisitionno +
//       '.</p>"<p><b>Reason</b></p><p>' +
//       reason +
//       '</p><p> To view, please click the link below: Link: <a href="' +
//       request_link +
//       '">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>' // plain text body
//   };
//   mailer.sendMail(mailOptions, res, next);
// };

/**
 * @author Idowu
 * @param {*} req
 * @param {*} res
 * @summary Handles email notification using sendgrid, leveraging handlebars,
 * @summary thus, the reason for `dynamic_template_data`
 * @summary which is a way of passing data to the email template on sendgrid
 */
const sendApprovalEmail = (req, res) => {
  const request_link = Utility.generateLink("/requisition/view/", req.id);
  const status = Status.getStatus(req.status);
  const reason = req.reason ? req.reason : "";
  const msg = {
    to: req.requestor.email,
    from: process.env.EMAIL_FROM,
    subject: `status ${req.requisitionno}`,
    templateId: process.env.APPROVAL_TEMPLATE_ID,
    dynamic_template_data: {
      subject: `status`,
      name: `${req.requestor.lastname}`,
      status: status,
      reason: reason,
      reqNo: req.requisitionno,
      request_link,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  // console.log(`Status: ${status}, reqNo: ${req.requisitionno}, reason: ${reason}`);
  mailer.sendMailer(msg, req, res);
};

/**
 * @author Idowu
 * @summary PR notification to Procurement
 */

const send_notification_to_procurement = (req, res) => {
  const request_link = Utility.generateLink("/requisition/view/", req.id);
  const msg = {
    to: process.env.PROCUREMENT_EMAIL,
    from: process.env.EMAIL_FROM,
    subject: "New Purchase Requisition",
    templateId: process.env.PROCUREMENT_PR_NOTIFICATION_TEMPLATE_ID,
    dynamic_template_data: {
      requisitionNo: req.requisitionno,
      request_link,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  mailer.sendMailer(msg, req, res);
};

exports.view = (req, res, next) => {
  PurchaseRequisition.findOne({ _id: req.params.id })
    .populate("requestor department vendor")
    .exec((err, doc) => {
      if (err) return next(err);
      res.send(doc);
    });
};

exports.updateStatus = (req, res, next) => {
  update(req, res, next, result => {
    PurchaseRequisition.findOne({ _id: req.params.id })
      .populate("requestor")
      .exec((err, doc) => {
        sendApprovalEmail(doc, res);
        send_notification_to_procurement(doc, res);
      });
    res.send(result);
  });
};

exports.resubmitted = (req, res, next) => {
  update(req, res, next, result => {
    if (err) return next(err);
    Department.findOne({ deparment: result.deparment })
      .populate("hod")
      .exec((err, dept) => {
        // if (err) return next(err);
        // send_new_requisition_email({ id: result.id, dept }, req, res);
        User.findOne({ _id: result.requestor }).exec((err, doc) => {
          if (err) {
            return next(err);
          }
          let requestor = doc.email;
          send_new_requisition_email(
            {
              id: r.id,
              dept,
              requisitionNo: requisitionNo.toUpperCase(),
              requestor
            },
            req,
            res
          );
        });
      });
  });
};

let update = (req, res, next, callback) => {
  PurchaseRequisition.updateOne(
    { _id: req.params.id },
    req.body,
    (err, result) => {
      if (err) return next(err);
      callback(result);
    }
  );
};

// const send_update_status_email = (req, res, next) => {};
