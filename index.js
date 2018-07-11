"use strict";
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var vendor = require('./route/vendor');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});
app.use(function(req, res, next){
    if(true){ //authorize request
        next();
    }else{
        //
    }
});

app.use('/vendors', vendor);


app.use(function (err, req, res, next) {

    res.status(500).send(err.message)
  })
  app.listen(3000, function(){
    console.log("Web server listening on port 3000");
  });