var mongoose = require("mongoose");
var RequestQuotation = mongoose.model("RequestQuotation");
var mailer = require("../model/mailer");
var Department = require("./departments");
var Utility = require("../commons/utility");
var User = mongoose.model("User");
var PurchasingItem = mongoose.model("PurchasingItem");
var VendorEvaluation = mongoose.model("VendorEvaluation");

exports.index = (req, res, next) => {
  let param = {};
  RequestQuotation.find(param)
    .populate("vendor requisition")
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      res.send(docs);
    });
};

let fetchVendorRespondedQuotes = callback => {
  RequestQuotation.find({ status: "RFQ02" })
    .populate("vendor")
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      callback(docs);
    });
};

exports.uniqueVendorListFromRespondedQuotes = (req, res, next) => {
  let id = [];
  fetchVendorRespondedQuotes(docs => {
    const filteredDocs = docs.filter(doc => {
      if (id.indexOf(doc.vendor.id) < 0) {
        id.push(doc.vendor.id);
        return doc;
      }
    });
    res.send(filteredDocs);
  });
};

exports.allRepliedQuoteFomVendor = (req, res, next) => {
  let ids = [];
  RequestQuotation.find({ vendor: req.params.vendorId, status: "RFQ02" }).exec(
    (err, docs) => {
      if (err) return next(err);
      else {
        docs.map((doc, i) => {
          ids.push(doc.id);
        });
        PurchasingItem.find({ quote: { $in: ids } }).exec((err, docs) => {
          res.send(docs);
        });
      }
    }
  );
};

exports.list = (req, res, next) => {
  RequestQuotation.find({ requisition: req.params.req })
    .populate("vendor requisition")
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      else res.send(docs);
    });
};

exports.vendorsQuoteList = (req, res, next) => {
  RequestQuotation.find({ vendor: req.params.vendorId })
    .populate("vendor requisition")
    .sort({ created: -1 })
    .exec((err, docs) => {
      if (err) return next(err);
      else res.send(docs);
    });
};

exports.submit = (req, res, next) => {
  let data = {};
  req.body.vendors.forEach((vendor, i) => {
    data.vendor = vendor.value;
    data.requisition = req.body.pr;
    data.requester =
      req.body.pr.requestor.lastname + " " + req.body.pr.requestor.firstname;
    data.lineitems = req.body.items;
    data.created = new Date();
    data.status = "RFQ01";
    data.service_type = req.body.pr.type;
    let requestquotation = new RequestQuotation(data);
    requestquotation.save(function(err, result) {
      if (err) return next(err);
      // saved!
      const prefix = "RFQ";
      const no = Utility.generateReqNo(
        prefix,
        req.body.pr.department.slug,
        result.id
      );
      RequestQuotation.updateOne(
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

exports.submitVendorQuote = (req, res, next) => {
  let data = req.body;
  RequestQuotation.findOne({ _id: data.id }, (err, result) => {
    if (err) return next(err);
    const mappedItems = data.items.map((e, i) => {
      let purchasingItem = new PurchasingItem(e);
      purchasingItem.quote = data.id;
      purchasingItem.service_type = result.service_type;
      purchasingItem.requester = result.requester;
      purchasingItem.save();
      return e;
    });
    result.creditterms = data.creditterms;
    result.lineitems = mappedItems;
    result.status = "RFQ02";
    RequestQuotation.updateOne({ _id: data.id }, result, (err, result) => {
      if (err) return next(err);
      res.send(result);
    });
  });
};

exports.view = (req, res, next) => {
  RequestQuotation.find({ _id: req.params.id })
    .populate("vendor requisition")
    .exec((err, doc) => {
      if (err) return next(err);
      res.send(doc);
    });
};

exports.update = (req, res, next) => {
  RequestQuotation.updateOne(
    { _id: req.params.id },
    req.body,
    (err, result) => {
      if (err) return next(err);
      res.send(result);
    }
  );
};

exports.acceptQoute = (req, res, next) => {
  if (
    req.body.meetRfqResponseTime &&
    req.body.meetDefineSpecification &&
    req.body.meetQuality &&
    req.body.onTimeDelivery
  ) {
    RequestQuotation.findOne({ _id: req.body.id }).exec((err, doc) => {
      if (err) return next(err);
      const totalScore =
        parseInt(req.body.meetRfqResponseTime) +
        parseInt(req.body.meetQuality) +
        parseInt(req.body.meetDefineSpecification) +
        parseInt(req.body.adaptiveness) +
        parseInt(req.body.onTimeDelivery);
      const avg = totalScore / 5;
      let data = {
        vendor: doc.vendor,
        meetQuality: req.body.meetQuality,
        meetDefineSpecification: req.body.meetDefineSpecification,
        meetRfqResponseTime: req.body.meetRfqResponseTime,
        adaptiveness: req.body.adaptiveness,
        onTimeDelivery: req.body.onTimeDelivery,
        avg: avg
      };
      let vendorEvaluation = new VendorEvaluation(data);
      vendorEvaluation.save(function(err, result) {
        if (err) return next(err);
      });
    });
  }
  RequestQuotation.updateOne({ _id: req.body.id }, req.body, (err, result) => {
    if (err) return next(err);
    if (req.body.accepted == "true") {
      send_po_accepted_email(req, res, next);
    } else if (req.body.accepted == "false") {
      send_po_rejected_email(req, res, next);
    }
    res.send(result);
  });
};

// let send_po_accepted_email = function(req, res, next) {
//   let mailOptions = {
//     from: process.env.EMAIL_FROM, // sender address
//     to: req.body.vendorEmail, //req.body.email, // list of receivers
//     subject: "Your PO Has Been Accepted", // Subject line
//     text:
//       "Dear Vendor\n Your PO has been approved.\n Kindly Logon unto the platform for more information.\nRegards \nThe Russelsmith Team.", // plain text body
//     html:
//       "<p>Dear Vendor, </p><p> Your PO has been approved.</p><p>  Kindly Logon unto the platform for more information.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>" // plain text body
//   };
//   mailer.sendMail(mailOptions, res, next);
// };

const send_po_accepted_email = (req, res) => {
  const msg = {
    to: req.body.vendorEmail,
    from: process.env.EMAIL_FROM,
    subject: `Your PO Has Been Accepted`,
    templateId: process.env.PO_ACCEPTED_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      subject: `Your PO Has Been Accepted`,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
};

// let send_po_rejected_email = function(req, res, next) {
//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: process.env.EMAIL_FROM, // sender address
//     to: req.body.vendorEmail, //req.body.email, // list of receivers
//     subject: "Your PO Has Been Rejected", // Subject line
//     text:
//       "Dear Vendor\n We did not approve your PO for the reasons stated below.\n " +
//       req.body.rejection_reason +
//       "\n" +
//       "For more information, kindly Logon unto the platform.\nRegards \nThe Russelsmith Team.", // plain text body
//     html:
//       "<p>Dear Vendor, </p><p> We did not approve your PO for the reasons stated below.</p> <p> " +
//       req.body.rejection_reason +
//       "</p><p> For more information, kindly Logon unto the platform.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>" // plain text body
//   };
//   mailer.sendMail(mailOptions, res, next);
// };
const send_po_rejected_email = (req, res) => {
  const msg = {
    to: req.body.vendorEmail,
    from: process.env.EMAIL_FROM,
    subject: `Your PO Has Been Rejected`,
    templateId: process.env.PO_REJECTED_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      subject: `Your PO Has Been Rejected`,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  mailer.sendMailer(msg, req, res);
};
