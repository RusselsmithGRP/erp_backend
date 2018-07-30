var mongoose = require('mongoose');
var Vendor = mongoose.model('Vendor');
var mailer = require('../model/mailer');

exports.index = (req, res, next)=>{
    Vendor.find().exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
    });
}

exports.approved = (req, res, next)=>{
    const query = { status: "APPROVED" };
    Vendor.find(query).exec((err, docs)=>{
        if (err) return next(err);
        res.send(docs);
    });
}

exports.pending = (req, res, next)=>{
    const query = { status: "PENDING" };
    Vendor.find(query).exec((err, docs)=>{
        if (err)return next(err);
        res.send(docs);
    });
}
exports.blacklisted = (req, res, next)=>{
    const query = { status: "BLACKLISTED" };
    Vendor.find(query).exec((err, docs)=>{
        if (err) return next(err);
        res.send(docs);
    });
}

exports.view = (req, res, next)=>{
    Vendor.find({_userId: req.params.user_id}).exec((err, doc)=>{
        if (err) return next(err);
        res.send(doc);
    })
}

exports.viewOne = (req, res, next)=>{
    Vendor.find({_id: req.params.id}).exec((err, doc)=>{
        if (err) return next(err);
        res.send(doc);
    })
}

exports.update = (req, res, next)=>{
    const data = req.body;
    const key = data.key;
    const value = data.value;
    Vendor.updateOne({[key]:value}, req.body.payload, (err,result)=>{
        if (err) return next(err);
        res.send(result);
    });
}

exports.updateStatus = (req, res, next)=>{
    const body = req.body;
    const key = body.key;
    const value = body.value;
    let data = (body.response)? {status:value, response:body.response}: {status:value};
    Vendor.updateOne({_id: key}, data, (err,result)=>{
        if (err)return next(err);
        if(value === "APPROVED"){
            send_approval_email(req, res, next);
        }else if(value === "UPDATE"){
            send_unapproval_email(req, res, next);
        }
        res.send(result);
    });
}

exports.create = (req, res, next)=>{
    const data = req.body;
    let vendor = new Vendor(data);
    vendor.save(function (err,result) {
        if (err) return next(err);
        // saved!
        res.send(result);
      });
}

let send_approval_email = function(req, res, next ){
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'kolawole.abobade@gmail.com', // sender address
        to: "kabobade@russelsmithgroup.com",//req.body.email, // list of receivers
        /* bcc: "eokwong@russelsmithgroup.com, kadeleke@russelsmithgroup.com", */
        subject: 'Vendor Application Approved', // Subject line
        text: 'Dear **Company Name**\nYour Vendor Application on the RusselSmith Vendor Management System has been approved. You can login to your account and use the full features of the system.\n For help, check out our Frequently Asked Questions page. \nRegards \nThe Russelsmith Team.', // plain text body
        html: '<p>Dear **Company Name**</p><br /><p>Your Vendor Application on the RusselSmith Vendor Management System has been approved. You can login to your account and use the full features of the system.</p><p>For help, check out our <u>Frequently Asked Questions page</u>.</p><br /><br /><p>Regards</p><p>The Russelsmith Team</p>'// html body
    };
    mailer.sendMail(mailOptions, res, next);
  
  }

  let send_unapproval_email = function(req, res, next ){
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'kolawole.abobade@gmail.com', // sender address
        to: "kabobade@russelsmithgroup.com",//req.body.email, // list of receivers
        /* bcc: "eokwong@russelsmithgroup.com, kadeleke@russelsmithgroup.com", */
        subject: 'Vendor Application Modification Required', // Subject line
        text: 'Dear **Company Name**\nYour Vendor Application was not accepted. Please see the comments below:.\n Sample Comments. \nRegards \nThe Russelsmith Team.', // plain text body
        html: '<p>Dear **Company Name**</p><br /><p>Your Vendor Application was not accepted. Please see the comments below:</p><p>Sample Comments.</p><br /><br /><p>Regards</p><p>The Russelsmith Team</p>'// html body
    };
    mailer.sendMail(mailOptions, res, next);
  
  }
