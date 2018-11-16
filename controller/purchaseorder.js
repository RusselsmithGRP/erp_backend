var mongoose = require('mongoose');
var PurchaseOrder = mongoose.model('PurchaseOrder');
var Department = require('./departments');
var Utility = require("../commons/utility");
var PurchasingItem = mongoose.model('PurchasingItem');
var User = mongoose.model('User');
var Status = require("../commons/Status");
var mailer = require('../model/mailer');

exports.index = (req, res, next)=>{
    PurchaseOrder.find().populate('vendor').sort("-created").exec((err, docs)=>{
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
    data.status = "POX0";
    let requestquotation = new PurchaseOrder(data);
    requestquotation.save(function (err,r) {
        if (err) return next(err);
            // saved!
        const prefix = "PO";
        const ref = Utility.generateReqNo(prefix, "PROC", r.id);
        r.no = ref.toUpperCase()
        PurchaseOrder.updateOne({_id:r.id}, r, (err,response)=>{
            if (err) return next(err);
            lineitems.forEach(e => {
                PurchasingItem.updateOne({_id:e}, {purchaseOrder: r.id}, (err,response)=>{
                    if (err) return next(err);
                });
            });
            sendPOEmail(r,res,next);z
            res.send({isOk:true});
        });
    });

}

let sendPOEmail = (req,res, next)=>{
    if(req.status == "POX0"){ 
        //"Awaiting Line Manager Review and Approval",
        send_mail_to_line_manager(req, res, next);
    }else if(req.status.indexOf("X") > -1){
        send_rejection_email(req,res, next)
    }else{
        send_approval_email(req, res, next);
    }
}

let send_mail_to_line_manager = (req, res, next)=>{
    User.findOne({_id: req.requestor}).populate('line_manager').exec((err, doc)=>{
        const request_link = Utility.generateLink("/order/view/",req.id);
        const status = Status.getStatus(req.status);
        const reason = (req.reason)? req.reason: "";
    
        let mailOptions = {
            from: process.env.EMAIL_FROM, // sender address
            to: doc.line_manager.email,
            //bcc: process.env.IAC_GROUP_EMAIL, 
            subject: status+ " "+ req.requisitionno, // Subject line
            text: ' Purchase order with No: '+req.no+' has just been submitted and needs your approval.\n To view, please click the link below: Link: '+request_link+' \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.', // plain text body
            html: '<p>Purchase order with No: '+req.no+' has just been submitted and needs your approval</p><p> To view, please click the link below: Link: <a href="'+request_link+'">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>', // plain text body
          };
        mailer.sendMail(mailOptions, res, next);
    })
}

let send_rejection_email = (req, res, next)=>{
        const request_link = Utility.generateLink("/order/view/",req.id);
        const status = Status.getStatus(req.status);
        const reason = (req.reason)? req.reason: "";
    
        let mailOptions = {
            from: process.env.EMAIL_FROM, // sender address
            to: req.requestor.email,
            //bcc: process.env.IAC_GROUP_EMAIL, 
            subject: status+ " "+ req.no, // Subject line
            text: ' Your purchase order with no: '+req.no+' has been rejected .\n Reason .\n'+reason+' \n To view, please click the link below: Link: '+request_link+' \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.', // plain text body
            html: '<p>Your purchase order with no '+req.no+' has been rejected.</p>"<p><b>Reason</b></p><p>'
            +reason+'</p><p> To view, please click the link below: Link: <a href="'+request_link+'">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>', // plain text body
          };
        mailer.sendMail(mailOptions, res, next);
}

let send_approval_email = (req, res, next)=>{
    const request_link = Utility.generateLink("/order/view/",req.id);
    const status = Status.getStatus(req.status);
    switch (req.status){
        case "PO01":
            Department.getHod(req.requestor.department, next, (doc)=>{
                let mailOptions = {
                    from: process.env.EMAIL_FROM, // sender address
                    to: doc.hod.email,
                    //bcc: process.env.IAC_GROUP_EMAIL, 
                    subject: status+ " "+ req.no, // Subject line
                    text: ' Purchase order No: '+req.no+' is awaiting your approval. \n To view, please click the link below: Link: '+request_link+' \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.', // plain text body
                    html: '<p> Purchase order No: '+req.no+' is awaiting your approval.</p><p> To view, please click the link below: Link: <a href="'+request_link+'">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>', // plain text body
                  };
                mailer.sendMail(mailOptions, res, next);
            })
            break;
        case "PO02":
            User.findOne({type: "ceo"}).populate('delegate').exec((err, doc)=>{
                let mailOptions = {
                    from: process.env.EMAIL_FROM, // sender address
                    to: doc.email,
                    //bcc: process.env.IAC_GROUP_EMAIL, 
                    subject: status+ " "+ req.no, // Subject line
                    text: ' Purchase order No: '+req.no+' is awaiting your approval. \n To view, please click the link below: Link: '+request_link+' \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.', // plain text body
                    html: '<p> Purchase order No: '+req.no+' is awaiting your approval.</p><p> To view, please click the link below: Link: <a href="'+request_link+'">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>', // plain text body
                  };
                mailer.sendMail(mailOptions, res, next);               
            })
            break;
        case "PO03":
            let mailOptions = {
                from: process.env.EMAIL_FROM, // sender address
                to:  process.env.PROCUREMENT_EMAIL,
                subject: status+ " "+ req.no, // Subject line
                text: status+' Purchase order with No: '+req.no+' has been approved by the CEO. \n To view, please click the link below: Link: '+request_link+' \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.', // plain text body
                html: '<p>'+status+' Purchase order with No: '+req.no+' has been approved by the CEO.</p><p> To view, please click the link below: Link: <a href="'+request_link+'">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>', // plain text body
            };
            mailer.sendMail(mailOptions, res, next);   
            break;
    }
}

exports.save = (req, res, next)=>{
    let data = {}
    data.requisition = req.body;
    data.created = new Date();
    data.status = "PO00";
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
    let data = req.body;
    const token = req.headers.authorization
    var user = new User();
    const tokenz = user.getUser(token);
    if(req.body.type == "approve"){
        switch(tokenz.type){
            case "hod":
                data.status = "PO02";
                break;
            case "ceo":
                data.status = "PO03";
                break;
            case "manager":
                data.status = "PO01";
                break;
        }
    }else{
        switch(tokenz.type){
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
    PurchaseOrder.updateOne({_id:req.params.id}, data, (err,result)=>{
        if (err) return next(err);
        PurchaseOrder.findOne({_id:req.params.id}).populate('requestor').exec((err, doc)=>{
            sendPOEmail(doc,res,next);
        })
        res.send(result);
    });
}