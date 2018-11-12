var mongoose = require('mongoose');
var RequestQuotation = mongoose.model('RequestQuotation');

var Department = require('./departments');
var Utility = require("../commons/utility");
var User = mongoose.model('User');
var PurchasingItem = mongoose.model('PurchasingItem');


exports.index = (req, res, next)=>{
    let param = {};
    RequestQuotation.find(param).populate('vendor requisition').exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
    });
}

let fetchVendorRespondedQuotes = (callback)=>{
    RequestQuotation.find({status: "RFQ02"}).populate('vendor').exec((err, docs)=>{
        if(err) return next(err);
        callback(docs);
    })
}


exports.uniqueVendorListFromRespondedQuotes = (req, res, next)=>{
    let id = [];
    fetchVendorRespondedQuotes((docs)=>{
        const filteredDocs = docs.filter(
            (doc)=>{
                if(id.indexOf(doc.vendor.id) < 0){
                    id.push(doc.vendor.id);
                    return doc;
                }
            }
        );
        res.send(filteredDocs);
    });
}

exports.allRepliedQuoteFomVendor = (req, res, next)=>{
    let ids = [];
    RequestQuotation.find({vendor: req.params.vendorId, status: "RFQ02"}).exec((err, docs)=>{
        if (err) return next(err);
        else {
            docs.map((doc, i)=>{
                ids.push(doc.id);
            })
            PurchasingItem.find({quote: { $in: ids }}).exec((err, docs)=>{
                res.send(docs);
            })
        }
    });
}

exports.list = (req, res, next)=>{
    RequestQuotation.find({requisition: req.params.req}).populate('vendor requisition').exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
    });
}

exports.vendorsQuoteList = (req, res, next)=>{
    RequestQuotation.find({vendor: req.params.vendorId}).populate('vendor requisition').exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
    });
}

 exports.submit = (req, res, next)=>{
    let data = {}
    req.body.vendors.forEach((vendor, i)=>{
        data.vendor = vendor.value;
        data.requisition = req.body.pr;
        data.lineitems = req.body.items;
        data.created = new Date();
        data.status = "RFQ01";
        let requestquotation = new RequestQuotation(data);
        requestquotation.save(function (err,result) {
            if (err) return next(err);
            // saved!
            const prefix = "RFQ";
            Utility.generateReqNo(prefix, req.body.pr.department.slug, result.id, (no)=>{
                RequestQuotation.updateOne({_id:result.id}, {no: no.toUpperCase()}, (err,result)=>{
                    if (err) return next(err);
                });
            });
          });
    });
    res.send({isOk:true});
}

exports.submitVendorQuote = (req, res,next)=>{
    let data = req.body;
    RequestQuotation.findOne({_id: data.id}, (err, result)=>{
        if (err) return next(err);
        let lineitems = result.lineitems;
        const mappedItems = lineitems.map((e, i)=>{
            e.price = data.items[i];
            let purchasingItem  = new PurchasingItem (e);
            purchasingItem.description = e.itemdescription;
            purchasingItem.quote = data.id;
            purchasingItem.save();
            return e;
        });
        result.creditterms = data.creditterms;
        result.lineitems = mappedItems;
        result.status = "RFQ02";
        RequestQuotation.updateOne({_id:data.id}, result, (err,result)=>{
            if (err) return next(err);
            res.send(result);
        });

    })
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