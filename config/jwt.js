var jwt = require('express-jwt');
const auth_secret = require('./secret');

var auth = jwt({
  secret: auth_secret,
  userProperty: 'payload'
});

module.exports = auth;