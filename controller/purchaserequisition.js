var mongoose = require('mongoose');
var PurchaseRequisition = mongoose.model('PurchaseRequisition');
var Department = require('./departments');
var Utility = require("../commons/utility");


exports.index = (req, res, next)=>{
    PurchaseRequisition.find().populate('requestor department').exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
    });
}


exports.save = (req, res, next)=>{
    const data = req.body;
    data.created = new Date();
    let purchaserequisition = new PurchaseRequistion(data);
    purchaserequisition.permission = [];
    purchaserequisition.save(function (err,result) {
        if (err) return next(err);
        // saved!
        res.send(result);
      });
}


 exports.submit = (req, res, next)=>{
    const data = req.body;
    data.created = new Date();
    let purchaserequisition = new PurchaseRequisition(data);
    purchaserequisition.permission = [];
    purchaserequisition.save(function (err,result) {
        if (err) return next(err);
        const prefix = "REQ";
        // saved!
        Utility.generateReqNo(prefix, data.departmentslug, result.id, (requisitionNo)=>{
            PurchaseRequisition.updateOne({_id:result.id}, {requisitionno: requisitionNo.toUpperCase()}, (err,result)=>{
                if (err) return next(err);
                res.send(result);
            });
        });

      });
}

exports.view = (req, res, next)=>{
    PurchaseRequisition.find({_id: req.params.id}).populate('requestor department').exec((err, doc)=>{
        if (err) return next(err);
        res.send(doc);
    });
}

exports.update = (req, res, next)=>{
    PurchaseRequisition.updateOne({_id:req.params.id}, req.body, (err,result)=>{
        if (err) return next(err);
        res.send(result);
    });
}