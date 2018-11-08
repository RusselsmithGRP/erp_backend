var mongoose = require('mongoose');
var PurchaseOrder = mongoose.model('PurchaseOrder');
var Department = require('./departments');
var Utility = require("../commons/utility");
var PurchasingItem = mongoose.model('PurchasingItem');
var User = mongoose.model('User');

exports.index = (req, res, next)=>{
    PurchaseOrder.find().populate('vendor').exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
    });
}

exports.submit = (req, res, next)=>{
    let data = req.body;
    let lineitems = req.body.lineitems;
    const token = req.headers.authorization
    var user = new User();
    const tokenz = user.getUser(token);
    data.created = new Date();
    data.requestor = tokenz._id
    data.status = "PO01";
    let requestquotation = new PurchaseOrder(data);
    requestquotation.save(function (err,result) {
        if (err) return next(err);
            // saved!
        const prefix = "PO";
        Utility.generateReqNo(prefix, "PROC", result.id, (no)=>{
            PurchaseOrder.updateOne({_id:result.id}, {no: no.toUpperCase()}, (err,r)=>{
                if (err) return next(err);
                lineitems.forEach(e => {
                    PurchasingItem.updateOne({_id:e}, {purchaseOrder: result.id}, (err,result)=>{
                        if (err) return next(err);
                    });
                });
                res.send({isOk:true});
            });
        });
    });

}

exports.save = (req, res, next)=>{
    let data = {}
    data.requisition = req.body;
    data.created = new Date();
    data.status = "PO01";
    let requestquotation = new PurchaseOrder(data);
    requestquotation.save(function (err,result) {
        if (err) return next(err);
            // saved!
        const prefix = "PO";
        Utility.generateReqNo(prefix, "PROC", result.id, (no)=>{
            PurchaseOrder.updateOne({_id:result.id}, {no: no.toUpperCase()}, (err,result)=>{
                if (err) return next(err);
            });
        });
    });
    res.send({isOk:true});
}

exports.view = (req, res, next)=>{
    PurchaseOrder.findOne({_id: req.params.id}).populate('vendor requestor').exec((err, po)=>{
        if (err) return next(err);
        PurchasingItem.find({purchaseOrder:req.params.id}).populate('quotation').exec((err,items)=>{
            res.send({po, items});
        });
    });
}

exports.update = (req, res, next)=>{
    PurchaseOrder.updateOne({_id:req.params.id}, req.body, (err,result)=>{
        if (err) return next(err);
        res.send(result);
    });
}