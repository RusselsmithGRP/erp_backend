"use strict";
require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express();
;
app.options('*', cors());
var bodyParser = require('body-parser');

var passport = require('passport');

// [SH] Bring in the data model
require('./model/db');
// [SH] Bring in the Passport config after model is defined
require('./config/passport');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



app.use(passport.initialize());
var vendor = require('./route/vendor');
var user = require('./route/user');
var department = require('./route/department');
var role = require('./route/role');
var purchaserequisition = require('./route/purchaserequisition');
var requestquotation = require('./route/requestquotation');

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
app.use('/users', user);
app.use('/departments', department);
app.use('/roles', role);
app.use('/purchase/requisition', purchaserequisition);
app.use('/purchase/quotation', requestquotation);


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
      }else{
        res.status(500).send(err.message);
      }
  })
  app.listen(3000, function(){
    console.log("Web server listening on port 3000");
  });