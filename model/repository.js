"use strict"
let MongoClient = require('mongodb').MongoClient
const assert = require('assert');

class Repository{

    constructor(db){
        this._db = db;
    }

    __connect(callback){
        MongoClient.connect('mongodb://localhost:27017/', callback);
    }

    findAll(doc, callback){
        this.__connect((err, client) =>{
            if (err) throw err
            let db = client.db(this._db);
            const collection = db.collection(doc);
            // Find some documents
            collection.find({}).toArray(function(err, docs) {
                assert.equal(err, null);
                return callback(docs);
            });
        });
    }

    find(doc, filter, callback){
        this.__connect((err, client)=> {
            if (err) throw err
            let db = client.db(this._db);
            const collection = db.collection(doc);
            // Find some documents
            collection.find(filter).toArray(function(err, docs) {
                assert.equal(err, null);
                return callback(docs);
            });
        });
    }

    updateOne(doc, param, newvalues, callback){
        this.__connect((err, client)=> {
            if(err) throw err
            let db = client.db(this._db);
            db.collection(doc).updateOne(param, {$set: newvalues}, (err, result)=>{
                assert.equal(err, null);
                return callback(result);
            });
        });  
    }

    addOne(doc, data, callback){
        this.__connect(function (err, client) {
            if (err) throw err
            let db = client.db(this._db);
            const collection = db.collection(doc);
            collection.insertOne(data, (err, result)=>{
                assert.equal(err, null);
                assert.equal(data.length, result.result.n);
                assert.equal(data.length, result.ops.length);
                return callback(result);
            })   
        });
    }

    delete(doc){}
}


module.exports = Repository;
