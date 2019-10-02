var mongoose = require("mongoose");
var PurchaseOrder = mongoose.model("PurchaseOrder");
var receiving = mongoose.model("receivingAndInspection");
var rejection = mongoose.model("rejectionLog");
var work = mongoose.model("workCompletion");
var Utility = require("../commons/utility");
var User = mongoose.model("User");
var mailer = require("../model/mailer");
var Status = require("../commons/Status");

exports.index = (req, res, next) => {
  receiving
    .find()
    .populate("recievied logs")
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      else res.send(docs);
    });
};

exports.allWorkCompletion = (req, res, next) => {
  work
    .find()
    .populate("all work completed")
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      else res.send(docs);
    });
};

exports.submit = (req, res, next) => {
  const data = req.body;
  data.created = new Date();
  data.purchaseOrder = data.doc.po._id;
  let receivingAndInspection = new receiving(data);
  // console.log(data.doc.po.requestor);
  receivingAndInspection.save((err, result) => {
    if (err) return next(err);
    send_receiving_and_notification_mail(req, res, result); // Email to STORE
    res.json({
      success: true,
      message: "new data has been saved!",
      result: result
    });
  });
};

exports.submitWorkCompletion = (req, res, next) => {
  const data = req.body;
  data.created = new Date();
  data.purchaseOrder = data.doc.po._id;
  let workCompletion = new work(data);
  workCompletion.save((err, result) => {
    if (err) return next(err);
    send_work_completion_mail(req, res, result);
    res.json({
      success: true,
      message: "new data has been saved!",
      result: result
    });
  });
};

exports.getinspectedproduct = (req, res, next) => {
  receiving
    .findOne({ purchaseOrder: req.params.id })
    .populate("recieving and inspection form")
    .exec((err, doc) => {
      if (err) return next(err);
      if (doc) {
        res.json({ result: doc });
      } else {
        res.send({ result: "nothing" });
      }
    });
};

exports.getIssuedWorkCompletion = (req, res, next) => {
  work
    .findOne({ purchaseOrder: req.params.id })
    .populate("Work Completion form")
    .exec((err, doc) => {
      if (err) return next(err);
      if (doc) {
        res.json({ result: doc });
      } else {
        res.send({ result: "nothing" });
      }
    });
};

exports.update = (req, res, next) => {
  const data = req.body;
  receiving.findByIdAndUpdate(data.productsInspectedID, data, function(
    err,
    doc
  ) {
    if (err) return next(err);
    send_mail_to_requestor(req, res, data.doc);
    res.json({ success: true, message: "data has been updated!", result: doc });
  });
};

exports.updateWorkCompletion = (req, res, next) => {
  const data = req.body;
  work.findByIdAndUpdate(data.servicesInspectedID, data, function(err, doc) {
    if (err) return next(err);
    res.json({ success: true, message: "data has been updated!", result: doc });
  });
};

exports.submitRejectionLog = (req, res, next) => {
  const data = req.body;
  data.created = new Date();
  data.purchaseOrder = data.doc.po._id;
  let rejectionlog = new rejection(data);
  rejectionlog.save((err, result) => {
    if (err) return next(err);
    res.json({
      success: true,
      message: "rejection log saved!",
      result: result
    });
  });
};

exports.allRejectionLogs = (req, res, next) => {
  rejection
    .find()
    .populate("rejection logs")
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      else res.send(docs);
    });
};

exports.getRejectionLog = (req, res, next) => {
  rejection
    .findOne({ _id: req.params.id })
    .populate("get individual rejection log")
    .exec((err, doc) => {
      if (err) return next(err);
      if (doc) {
        res.json({ result: doc });
      } else {
        res.send({ result: "nothing" });
      }
    });
};

const send_mail_to_requestor = (req, res, doc) => {
  const msg = {
    to: doc.po.requestor.email,
    from: process.env.EMAIL_FROM,
    subject: "Notification of Item Delivery",
    templateId: process.env.INVENTORY_ITEM_REQUESTOR_TEMPLATE_ID,
    dynamic_template_data: {
      redirect_link: `${process.env.PUBLIC_URL}/receiving/${doc.po._id}`,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  emailTemplate(req, res, msg);
};

const send_receiving_and_notification_mail = (req, res, doc) => {
  const msg = {
    to: process.env.PROCUREMENT_EMAIL,
    from: process.env.EMAIL_FROM,
    cc: process.env.ASSET_UNIT_GROUP_EMAIL,
    subject: "New Item Received",
    templateId: process.env.RECEIVING_AND_INSPECTION_NOTIFICATION_TEMPLATE_ID,
    dynamic_template_data: {
      redirect_link: `${process.env.PUBLIC_URL}/receiving/${doc.purchaseOrder}`,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  emailTemplate(req, res, msg);
};

const send_work_completion_mail = (req, res, doc) => {
  const msg = {
    to: process.env.PROCUREMENT_EMAIL,
    from: process.env.EMAIL_FROM,
    subject: "Work Completion Form",
    templateId: process.env.WORK_COMPLETION_TEMPLATE_ID,
    dynamic_template_data: {
      redirect_link: `${process.env.PUBLIC_URL}/receiving/${doc.purchaseOrder}`,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  emailTemplate(req, res, msg);
};

const emailTemplate = (req, res, msg) => {
  return mailer.sendMailer(msg, req, res);
};
