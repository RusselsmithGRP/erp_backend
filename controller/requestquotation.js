var mongoose = require('mongoose');
var RequestQuotation = mongoose.model('RequestQuotation');

var Department = require('./departments');


exports.index = (req, res, next)=>{
    RequestQuotation.find().populate('vendor requisition').exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
    });
}


exports.list = (req, res, next)=>{
    RequestQuotation.find({requisition: req.params.req}).populate('vendor requisition').exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
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
    let data = {}
    req.body.vendors.forEach((vendor, i)=>{
        data.vendor = vendor.value;
        data.requisition = req.body.prId;
        data.lineitems = req.body.items;
        data.created = new Date();
        let requestquotation = new RequestQuotation(data);
        requestquotation.permission = [];
        requestquotation.save(function (err,result) {
            if (err) return next(err);
          });
    });
    res.send({isOk:true});
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