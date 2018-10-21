var mongoose = require('mongoose');
var RequestQuotation = mongoose.model('requestquotation');

var Department = require('./departments');


exports.index = (req, res, next)=>{
    RequestQuotation.find().populate('vendor requisition').exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
    });
}


exports.save = (req, res, next)=>{
    const data = req.body;
    let requestquotation = new PurchaseRequistion(data);
    requestquotation.permission = [];
    requestquotation.save(function (err,result) {
        if (err) return next(err);
        // saved!
        res.send(result);
    });
}

let generateReqNo = (departmentId, eid, id, callback)=>{
    Department.findDeparmentDetails(departmentId, (doc)=>{
        const eidsubstr = eid.substring(eid.length - 4);
        const idsubstr = id.substring(id.length - 6);
        callback(doc['0'].code+"/"+eidsubstr+"/"+idsubstr);
    });

}

 exports.submit = (req, res, next)=>{
    const data = req.body;
    let requestquotation = new RequestQuotation(data);
    requestquotation.permission = [];
    requestquotation.save(function (err,result) {
        if (err) return next(err);
        // saved!
        generateReqNo(data.department, data.eid, result.id, (requisitionNo)=>{
            RequestQuotation.updateOne({_id:result.id}, {requisitionno: requisitionNo}, (err,result)=>{
                if (err) return next(err);
                res.send(result);
            });
        });

      });
}

exports.view = (req, res, next)=>{
    RequestQuotation.find({_id: req.params.id}).populate('vendor requisition').exec((err, doc)=>{
        if (err) return next(err);
        res.send(doc);
    });
}

exports.update = (req, res, next)=>{
    RequestQuotation.updateOne({_id:req.params.id}, req.body, (err,result)=>{
        if (err) return next(err);
        res.send(result);
    });
}