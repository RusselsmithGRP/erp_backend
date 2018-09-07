var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Vendor = mongoose.model('Vendor');
var mailer = require('../model/mailer');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res, next) {
  var user = new User();

  user.email = req.body.email;
  user.role = req.body.role;

  user.setPassword(req.body.password);

  user.save(function(err) {
    if(err) return next(err);
    var token;
    token = user.generateJwt();
    if(user.role === "vendor"){
      let vendor = new Vendor({user:user._id, general_info:{company_name:req.body.coy_name}});
      vendor.save(function (err) {
        if(err) return next(err);
        send_user_registration_email(req, res, next);
        res.status(200);
        res.json({
          "token" : token
        });
      });
    }else{
     /// send_user_registration_email(req, res, next);
    
    }
  });

};


let send_user_registration_email = function(req, res, next ){
  // setup email data with unicode symbols
  let mailOptions = {
      from: process.env.EMAIL_FROM, // sender address
      to: req.body.email,//req.body.email, // list of receivers
      bcc: process.env.IAC_GROUP_EMAIL, 
      subject: 'New Vendor Account Confirmation', // Subject line
      text: 'Dear '+req.body.coy_name+'\n Thank you for creating an account on RS Edge, RusselSmith’s Vendor Management Platform.\n To continue the vendor registration, please click the link below: Confirmation Link: '+process.env.ABSOLUTE_LINK+'/login \n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.', // plain text body
      html: '<p>Dear '+req.body.coy_name+', </p><p>Thank you for creating an account on RS Edge, RusselSmith’s Vendor Management Platform.</p><p> To continue the vendor registration, please click the link below: Confirmation Link: <a href="'+process.env.ABSOLUTE_LINK+'/login">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>', // plain text body
    };
  mailer.sendMail(mailOptions, res, next);

}

module.exports.login = function(req, res) {

  passport.authenticate('local', function(err, user, info){
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token,
        user : user,
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};

module.exports.index = function(req, res){

}

module.exports.view = function(req, res) {

    // If no user ID exists in the JWT return a 401
    if (!req.payload._id) {
      res.status(401).json({
        "message" : "UnauthorizedError: private profile"
      });
    } else {
      // Otherwise continue
      User
        .findById(req.payload._id)
        .exec(function(err, user) {
          res.status(200).json(user);
        });
    }
  
  };