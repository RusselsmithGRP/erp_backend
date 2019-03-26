var mongoose = require('mongoose');
var PurchaseOrder = mongoose.model('PurchaseOrder');
var receiving = mongoose.model('receivingAndInspection');
var rejection = mongoose.model('rejectionLog');
var work = mongoose.model('workCompletion');
var Utility = require("../commons/utility");
var User = mongoose.model('User');
var mailer = require('../model/mailer');
var Status = require("../commons/Status");

exports.submit = (req, res, next) => {
     const data = req.body;
    data.created = new Date();
    data.purchaseOrder = data.doc.po._id;
    let receivingAndInspection = new receiving(data);
    receivingAndInspection.save((err, result)=> {
        if (err) return next(err);
        res.json({ success: true, message: "new data has been saved!", result: result});   
    });
}

exports.submitWorkCompletion = (req, res, next) => {
   const data = req.body;
   data.created = new Date();
   data.purchaseOrder = data.doc.po._id;
   let workCompletion = new work(data);
   workCompletion.save((err, result)=> {
       if (err) return next(err);
       res.json({ success: true, message: "new data has been saved!", result: result});   
   });
}

exports.getinspectedproduct = (req, res, next)=>{
    receiving.findOne({purchaseOrder: req.params.id}).populate('recieving and inspection form').exec((err, doc)=>{
        if (err) return next(err);
        if (doc) {
            res.json({result: doc});
        }
        else {
            res.send({result: "nothing"});
        }
    });
}

exports.getIssuedWorkCompletion = (req, res, next)=>{
    work.findOne({purchaseOrder: req.params.id}).populate('Work Completion form').exec((err, doc)=>{
        if (err) return next(err);
        if (doc) {
            res.json({result: doc});
        }
        else {
            res.send({result: "nothing"});
        }
    });
}

exports.update = (req, res, next) => {
    const data = req.body;
    receiving.findByIdAndUpdate(data.productsInspectedID, data, function(err, doc){
       if (err) return next(err);
       res.json({ success: true, message: "data has been updated!", result: doc});   
   });
}

exports.updateWorkCompletion = (req, res, next) => {
    const data = req.body;
    work.findByIdAndUpdate(data.servicesInspectedID, data, function(err, doc){
       if (err) return next(err);
       res.json({ success: true, message: "data has been updated!", result: doc});   
   });
}

exports.submitRejectionLog = (req, res, next) => {
    const data = req.body;
   data.created = new Date();
   data.purchaseOrder = data.doc.po._id;
   let rejectionlog = new rejection(data);
   rejectionlog.save((err, result)=> {
       if (err) return next(err);
       res.json({ success: true, message: "rejection log saved!", result: result});   
   });  
}

exports.allRejectionLogs = (req, res, next) => {
    rejection.find()
      .populate("rejection logs")
      .sort({ created: -1 })
      .exec((err, docs) => {
        if (err) return next(err);
        else res.send(docs);
      });
  };

  exports.getRejectionLog = (req, res, next)=>{
    rejection.findOne({_id: req.params.id}).populate('get individual rejection log').exec((err, doc)=>{
        if (err) return next(err);
        if (doc){
            res.json({result: doc});
        }
        else {
            res.send({result: "nothing"});
        }
    });
}