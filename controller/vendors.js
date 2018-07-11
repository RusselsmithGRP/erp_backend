"use strict";
var Repository = require('../model/repository');
let repository = new Repository('erp'); 


exports.index = (req, res)=>{
    repository.findAll('vendors', (docs)=>{
        res.send(docs);
    });
}

exports.view = (req, res)=>{
    repository.find('vendors',{user_id: req.params.user_id}, (doc)=>{
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

exports.create = (req, res)=>{
    const data = req.body;
    let done = repository.add('vendors', data);
    res.send(done);
}
