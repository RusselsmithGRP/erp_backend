"use strict";
var Repository = require('../model/repository');
let repository = new Repository('erp'); 
var ObjectId = require('mongodb').ObjectID;


exports.index = (req, res)=>{
    repository.findAll('vendors', (docs)=>{
        res.send(docs);
    });
}


exports.approved = (req, res)=>{
    const query = { status: "APPROVED" };
    repository.find('vendors', query, (docs)=>{
        res.send(docs);
    });
}
exports.pending = (req, res)=>{
    const query = { status: "PENDING" };
    repository.find('vendors', query, (docs)=>{
        res.send(docs);
    });
}
exports.blacklisted = (req, res)=>{
    const query = { status: "BLACKLISTED" };
    repository.find('vendors', query, (docs)=>{
        res.send(docs);
    });
}
exports.view = (req, res)=>{
    repository.find('vendors',{user_id: parseInt(req.params.user_id)}, (doc)=>{
        res.send(doc);
    })
}

exports.viewOne = (req, res)=>{
    repository.find('vendors',{_id: ObjectId(req.params.id)}, (doc)=>{
        res.send(doc);
    })
}

exports.update = (req, res)=>{
    const data = req.body;
    const key = data.key;
    const value = data.value;
    repository.updateOne('vendors',{[key]:value}, req.body.payload, (result)=>{
        res.send(result);
    });
}

exports.updateStatus = (req, res)=>{
    const body = req.body;
    const key = body.key;
    const value = body.value;
    let data = (body.response)? {status:value, response:body.response}: {status:value};
    repository.updateOne('vendors',{_id: ObjectId(key)}, data, (result)=>{
        res.send(result);
    });
}

exports.create = (req, res)=>{
    const data = req.body;
    let done = repository.add('vendors', data);
    res.send(done);
}
