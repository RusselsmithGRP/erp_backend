var mongoose = require("mongoose");
var PurchaseOrder = mongoose.model("PurchaseOrder");
var Department = require("./departments");
var Utility = require("../commons/utility");
var PurchasingItem = mongoose.model("PurchasingItem");
var User = mongoose.model("User");
var Status = require("../commons/Status");
var mailer = require("../model/mailer");

exports.index = (req, res, next) => {
  PurchaseOrder.find()
    .populate("vendor")
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      else res.send(docs);
    });
};

exports.submit = (req, res, next) => {
  let data = req.body;
  let lineitems = req.body.lineitems;
  const token = req.headers.authorization;
  var user = new User();
  const tokenz = user.getUser(token);
  data.created = new Date();
  data.requestor = tokenz._id;
  data.status = "POX0";
  let requestquotation = new PurchaseOrder(data);
  requestquotation.save(function(err, r) {
    if (err) return next(err);
    // saved!
    const prefix = "PO";
    const ref = Utility.generateReqNo(prefix, "PROC", r.id);
    r.no = ref.toUpperCase();
    PurchaseOrder.findOneAndUpdate({ _id: r.id }, { $set: r }, { new: true })
      .populate("requestor")
      .exec((err, response) => {
        if (err) return next(err);
        lineitems.forEach(e => {
          PurchasingItem.updateOne(
            { _id: e },
            { purchaseOrder: r.id },
            (err, res) => {
              if (err) return next(err);
            }
          );
        });
        sendPOEmail(r, res, response, next);
        res.send({ isOk: true });
      });
  });
};

let sendPOEmail = (req, res, staff, next) => {
  if (req.status == "POX0") {
    //"Awaiting Line Manager Review and Approval",
    // send_mail_to_line_manager(req, res, next);
    send_mail_to_reviewer(req, res); // Email sent to reviewer for Approval/Rejection
  } else if (req.status.indexOf("X") > -1) {
    send_rejection_email(req, res, next);
  } else {
    send_approval_email(req, res, staff, next);
  }
};

// let send_mail_to_line_manager = (req, res, next) => {
//   User.findOne({ _id: req.requestor }).populate("line_manager").exec((err, doc) => {
//       const request_link = Utility.generateLink("/order/view/", req.id);
//       const status = Status.getStatus(req.status);
//       const reason = req.reason ? req.reason : "";

//       let mailOptions = {
//         from: process.env.EMAIL_FROM, // sender address
//         to: doc.line_manager.email,
//         //bcc: process.env.IAC_GROUP_EMAIL,
//         subject: status + " " + req.requisitionno, // Subject line
//         text:
//           " Purchase order with No: " +
//           req.no +
//           " has just been submitted and needs your approval.\n To view, please click the link below: Link: " +
//           request_link +
//           " \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.", // plain text body
//         html:
//           "<p>Purchase order with No: " +
//           req.no +
//           ' has just been submitted and needs your approval</p><p> To view, please click the link below: Link: <a href="' +
//           request_link +
//           '">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>' // plain text body
//       };
//       mailer.sendMail(mailOptions, res, next);
//     });
// };

/**
 * @author Idowu
 * @param {*} req
 * @param {*} res
 * @summary Sends Email to the line manager leveraging handlebars to handle dynamic content.
 */
const send_mail_to_line_manager = (req, res) => {
  User.findOne({ _id: req.requestor })
    .populate("line_manager")
    .exec((err, doc) => {
      const request_link = Utility.generateLink("/order/view/", req.id);
      const status = Status.getStatus(req.status);
      const reason = req.reason ? req.reason : "";

      const msg = {
        to: doc.line_manager.email,
        from: process.env.EMAIL_FROM,
        subject: `${status} ${req.requisitionno}`,
        templateId: process.env.LINE_MANAGER_TEMPLATE_ID,
        dynamic_template_data: {
          status,
          submitter: doc.email,
          reqNo: req.requisitionno,
          purchaseNo: req.no,
          request_link,
          sender_phone: "+234 706 900 0900",
          sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
        }
      };
      // mailer.sendMail(msg, res, next);
      mailer.sendMailer(msg, req, res);
    });
};

// let send_rejection_email = (req, res, next) => {
//   const request_link = Utility.generateLink("/order/view/", req.id);
//   const status = Status.getStatus(req.status);
//   const reason = req.reason ? req.reason : "";

//   let mailOptions = {
//     from: process.env.EMAIL_FROM, // sender address
//     to: req.requestor.email,
//     //bcc: process.env.IAC_GROUP_EMAIL,
//     subject: status + " " + req.no, // Subject line
//     text:
//       " Your purchase order with no: " +
//       req.no +
//       " has been rejected .\n Reason .\n" +
//       reason +
//       " \n To view, please click the link below: Link: " +
//       request_link +
//       " \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.", // plain text body
//     html:
//       "<p>Your purchase order with no " +
//       req.no +
//       ' has been rejected.</p>"<p><b>Reason</b></p><p>' +
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
 * @summary Rejection email notifying requestor as to why purchase order was rejected.
 * @implements handlebars for dynamic content
 */

const send_rejection_email = (req, res) => {
  const request_link = Utility.generateLink("/order/view/", req.id);
  const status = Status.getStatus(req.status);
  const reason = req.reason ? req.reason : "";
  const msg = {
    to: req.requestor.email,
    from: process.env.EMAIL_FROM,
    bcc: process.env.PROCUREMENT_EMAIL,
    subject: `${status} ${req.no}`,
    templateId: process.env.REJECTION_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      status,
      purchaseNo: req.no,
      reason,
      request_link,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  mailer.sendMailer(msg, req, res);
};

// let send_approval_email = (req, res, next) => {
//   const request_link = Utility.generateLink("/order/view/", req.id);
//   const status = Status.getStatus(req.status);
//   switch (req.status) {
//     case "PO01":
//       Department.getHod(req.requestor.department, next, doc => {
//         let mailOptions = {
//           from: process.env.EMAIL_FROM, // sender address
//           to: doc.hod.email,
//           //bcc: process.env.IAC_GROUP_EMAIL,
//           subject: status + " " + req.no, // Subject line
//           text:
//             " Purchase order No: " +
//             req.no +
//             " is awaiting your approval. \n To view, please click the link below: Link: " +
//             request_link +
//             " \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.", // plain text body
//           html:
//             "<p> Purchase order No: " +
//             req.no +
//             ' is awaiting your approval.</p><p> To view, please click the link below: Link: <a href="' +
//             request_link +
//             '">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>' // plain text body
//         };
//         mailer.sendMail(mailOptions, res, next);
//       });
//       break;
//     case "PO02":
//       User.findOne({ type: "ceo" })
//         .populate("delegate")
//         .exec((err, doc) => {
//           let mailOptions = {
//             from: process.env.EMAIL_FROM, // sender address
//             to: doc.email,
//             //bcc: process.env.IAC_GROUP_EMAIL,
//             subject: status + " " + req.no, // Subject line
//             text:
//               " Purchase order No: " +
//               req.no +
//               " is awaiting your approval. \n To view, please click the link below: Link: " +
//               request_link +
//               " \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.", // plain text body
//             html:
//               "<p> Purchase order No: " +
//               req.no +
//               ' is awaiting your approval.</p><p> To view, please click the link below: Link: <a href="' +
//               request_link +
//               '">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>' // plain text body
//           };
//           mailer.sendMail(mailOptions, res, next);
//         });
//       break;
//     case "PO03":
//       let mailOptions = {
//         from: process.env.EMAIL_FROM, // sender address
//         to: process.env.PROCUREMENT_EMAIL,
//         subject: status + " " + req.no, // Subject line
//         text:
//           status +
//           " Purchase order with No: " +
//           req.no +
//           " has been approved by the CEO. \n To view, please click the link below: Link: " +
//           request_link +
//           " \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.", // plain text body
//         html:
//           "<p>" +
//           status +
//           " Purchase order with No: " +
//           req.no +
//           ' has been approved by the CEO.</p><p> To view, please click the link below: Link: <a href="' +
//           request_link +
//           '">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>' // plain text body
//       };
//       mailer.sendMail(mailOptions, res, next);
//       break;
//   }
// };

/**
 * @author Idowu
 * @param {*} req Request
 * @param {*} res Response
 * @summary Sends Approval Email to procurement department.
 * @summary Utilizes sendgrid's handlebars templating engine to accomodate dynamic data.
 *
 */
const send_approval_email = (req, res, staff) => {
  const request_link = Utility.generateLink("/order/view/", req.id);
  const status = Status.getStatus(req.status);
  switch (req.status) {
    case "PO01":
      Department.getHod2({ slug: "procurement" }, next, doc => {
        const msg = {
          to: doc.hod.email,
          from: process.env.EMAIL_FROM,
          subject: `${status} ${req.no}`,
          templateId: process.env.PURCHASE_ORDER_APPROVAL_TEMPLATE_ID,
          dynamic_template_data: {
            subject: `${status} ${req.no}`,
            status: status,
            purchaseNo: req.no,
            p1: `Purchase order No: ${req.no} is awaiting your approval.`,
            request_link,
            sender_phone: "+234 706 900 0900",
            sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
          }
        };
        mailer.sendMailer(msg, req, res);
      });
      break;
    case "PO02":
      User.findOne({ type: "ceo" })
        .populate("delegate")
        .exec((err, doc) => {
          const msg = {
            to: doc.email,
            from: process.env.EMAIL_FROM,
            subject: `${status} ${req.no}`,
            templateId: process.env.PURCHASE_ORDER_APPROVAL_TEMPLATE_ID,
            dynamic_template_data: {
              subject: `${status} ${req.no}`,
              status: status,
              purchaseNo: req.no,
              p1: `Purchase order No: ${req.no} is awaiting your approval.`,
              request_link,
              sender_phone: "+234 706 900 0900",
              sender_address:
                "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
            }
          };
          mailer.sendMailer(msg, req, res);
        });
      break;
    case "PO03":
      const msg = {
        to: staff.requestor.email,
        from: process.env.EMAIL_FROM,
        cc: process.env.PROCUREMENT_EMAIL,
        subject: `${status} ${req.no}`,
        templateId: process.env.PURCHASE_ORDER_APPROVAL_TEMPLATE_ID,
        dynamic_template_data: {
          subject: `${status} ${req.no}`,
          status,
          purchaseNo: req.no,
          p1: `${status} Purchase order with No: ${req.no} has been approved by the CEO.`,
          request_link,
          sender_phone: "+234 706 900 0900",
          sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
        }
      };
      mailer.sendMailer(msg, req, res);
      break;
  }
};

exports.save = (req, res, next) => {
  let data = {};
  data.requisition = req.body;
  data.created = new Date();
  data.status = "PO00";
  let requestquotation = new PurchaseOrder(data);
  requestquotation.save(function(err, result) {
    if (err) return next(err);
    // saved!
    const prefix = "PO";
    Utility.generateReqNo(prefix, "PROC", result.id, no => {
      PurchaseOrder.updateOne(
        { _id: result.id },
        { no: no.toUpperCase() },
        (err, result) => {
          if (err) return next(err);
        }
      );
    });
  });
  res.send({ isOk: true });
};

exports.view = (req, res, next) => {
  PurchaseOrder.findOne({ _id: req.params.id })
    .populate("vendor requestor reviewedBy authorizedBy approvedBy")
    .exec((err, po) => {
      if (err) return next(err);
      PurchasingItem.find({ purchaseOrder: req.params.id })
        .populate("quotation")
        .exec((err, items) => {
          res.send({ po, items });
        });
    });
};

exports.update = (req, res, next) => {
  let data = req.body;
  const token = req.headers.authorization;
  var user = new User();
  const tokenz = user.getUser(token);
  if (req.body.type == "approve") {
    switch (tokenz.type) {
      case "hod":
        data.status = "PO02";
        data.authorizedBy = tokenz._id;
        break;
      case "ceo":
        data.status = "PO03";
        data.approvedBy =  tokenz._id;
        break;
      case "manager":
        data.status = "PO01";
        data.reviewedBy =  tokenz._id;
        break;
    }
  } else {
    switch (tokenz.type) {
      case "hod":
        data.status = "POX2";
        break;
      case "ceo":
        data.status = "POX3";
        break;
      case "manager":
        data.status = "POX1";
        break;
    }
  }
  //console.log(data, "data")
  PurchaseOrder.updateOne({ _id: req.params.id }, data, (err, result) => {
    if (err) return next(err);
    PurchaseOrder.findOne({ _id: req.params.id })
      .populate("requestor")
      .exec((err, doc) => {
        sendPOEmail(doc, res, next);
      });
    res.send(result);
  });
};

exports.terms = (req, res, next) => {
  PurchaseOrder.updateOne({ _id: req.body.id }, req.body, (err, result) => {
    if (err) return next(err);
    res.send(result);
  });
};

// /**
//  * @author Idowu
//  * @param {*} req
//  * @param {*} res
//  * @typedef {{ req: Request, res: Response }}
//  */
// const send_mail_to_procurement = (req, res) => {
//   const msg = {
//     to: process.env.PROCUREMENT_EMAIL,
//     from: process.env.EMAIL_FROM,
//     bcc: ["mmazhar@russelsmithgroup.com", "sgiwa-osagie@russelsmithgroup.com"],
//     subject: "PO Approval Required",
//     templateId: process.env.PROCUREMENT_PO_NOTIFICATION_TEMPLATE_ID
//   };
//   mailer.sendMailer(msg, req, res);
// };

/**
 * @author Idowu
 * @param {*} req
 * @param {*} res
 * @typedef {{ req: Request, res: Response }}
 * @summary First Email to be fired once a requestor requests a PO
 */
const send_mail_to_reviewer = (req, res) => {
  User.findOne({ _id: req.requestor })
    .populate("line_manager")
    .exec((err, doc) => {
      const request_link = Utility.generateLink("/order/view/", req.id);
      const status = Status.getStatus(req.status);
      const reason = req.reason ? req.reason : "";

      const msg = {
        to: "sgiwa-osagie@russelsmithgroup.com",
        from: process.env.EMAIL_FROM,
        subject: `${status} ${req.requisitionno}`,
        templateId: process.env.FIRST_REVIEWER_TEMPLATE_ID,
        dynamic_template_data: {
          status,
          submitter: doc.email,
          reqNo: req.requisitionno,
          purchaseNo: req.no,
          request_link,
          sender_phone: "+234 706 900 0900",
          sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
        }
      };
      mailer.sendMailer(msg, req, res);
    });
};
