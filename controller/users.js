var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Vendor = mongoose.model('Vendor');
var mailer = require('../model/mailer');
var crypto = require('crypto');

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
     send_user_registration_email(req, res, next);
    }
  });

}


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

let send_email_reset_token = function(resetToken, req, res, next ){
  // setup email data with unicode symbols
  let mailOptions = {
      from: process.env.EMAIL_FROM, // sender address
      to: req.body.email,//req.body.email, // list of receivers
      bcc: process.env.IAC_GROUP_EMAIL, 
      subject: 'Reset Your Password', // Subject line
      text: 'A password request has just been initaited on your account! \n Please click the link below to reset your password. \n<a href="'+process.env.ABSOLUTE_LINK+'/resetpassword/'+resetToken+'">RS Edge</a>  \n If this is not you, please kindly ignore this email.', // plain text body
      html: '<p>A password request has just been initaited on your account!</p><p> Please click the link below to reset your password. </p> <p> <a href="'+process.env.ABSOLUTE_LINK+'/resetpassword/'+resetToken+'">RS Edge</a></p><p>If this is not you, please kindly ignore this email</p>', // plain text body
    };
  mailer.sendMail(mailOptions, res, next);

}

let generateToken = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

let isRsEmail = (email)=>{
  return email.search("russelsmithgroup.com");
}

module.exports.login = function(req, res) {
  let passportMode;
  if(isRsEmail(req.body.email) >= 0 ){
    passportMode = "custom";
  }else{
    passportMode = "local";
  }
  passport.authenticate(passportMode, function(err, user, info){
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
  


}

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

  module.exports.updateProfileData = function(req, res){
   let data = {
    email: req.body.email,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    eid: req.body.eid,
    department: req.body.department,
    role: req.body.role,
    updatedAt: Date.now(),
  };
  User.findByIdAndUpdate(req.body._id, data, function(err, profileData){
  if(err) { res.send(err);}
  res.json({ success:true, message: "profile has been updated!", profile: profileData});
});
  }
  

  module.exports.requestResetToken = function(req, res, next){
    User.findOne({email:req.body.email}).select().exec(function(err, user){
      if(err){
        return res.json({success:false, message: "error here" + err})
      }else {
        if(!user) {
          return res.json({success:false, message: "Password reset email has been sent to the email provided"})
        }
        else {
          let resetToken = generateToken();
          User.findOneAndUpdate(
              {email: req.body.email},
              {$set:{token: resetToken}},
              {new: true},
              (err, user) =>{
                  if(err){
                    res.send(err);
                  }
                  //res.json(user)
                  send_email_reset_token(resetToken, req, res, next);
                  res.status(200);
                  res.json({
                    success:true, message: "Password reset email has been sent to the email provided!"
                  }) 
              });
        }
    }     
    })

  }
  
  module.exports.resetThePassword = function(req, res){
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    User.findOne({token:req.params.token}).select().exec(function(err, user){
       if(err){
        return res.json({success:false, message: err})
       }else {
         if(!user) {
          return  res.json({success:false, message: "wrong token"})
         }
         if(password === confirmPassword && confirmPassword !== "")  {
             user.setPassword(confirmPassword);
             user.save(function(err) {
               if(err) return next(err);
              return res.json({success:true, message: "password has been reset"});
             })
           }
           else {
            return res.json({success:false, message: "passwords does not match"});
           }
       }     
     })
   }

  module.exports.changeYourPassword = function(req, res){
    let oldPassword = req.body.oldPassword;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    User.findOne({ _id: req.body.id }, function (err, user) {
      if (user.validPassword(oldPassword)) {
        if (password === confirmPassword && confirmPassword !== "") {
          user.setPassword(confirmPassword);
          user.save(function(err) {
            if(err) return next(err);
           return res.json({success:true, message: "password has been reset"})
          })
        }
        else {
          return res.json({success:false, message: "new passwords do not match"})
        }
      }
      else{
        return res.json({success:false, message: "old password does not match"})
      }
    });
   }
   

  module.exports.confirmtoken = function(req, res){
    User.findOne({token:req.params.token}).select().exec(function(err, user){
        if(err){
          res.json({tokenState:false, message: err});
          return;
        }else {
          if(!user) {
            res.json({tokenState:false});
            return;
          }
          else {
            res.json({tokenState:true});
            return;
          }
        }     
    })
  }
   
  module.exports.deleteUser = function(userId){
    User.deleteOne({_id: userId}).select().exec(function(err, user){

    })   
  }

  module.exports.findAllStaff = function(req, res){
    User.find({ role:({$ne: 'admin', $ne:'vendor'})}).exec(function(err, users){
      if(err){
        res.json({message: err})
        return;
      }
      res.status(200).json(users);   
    });
  }

  module.exports.createNewUser = function(req, res, next){
    var user = new User();
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.eid = req.body.eid;
    user.role = req.body.role;
    user.department = req.body.department;
    user.type = req.body.type;

    user.save(function(err) {
      if(err) {
       return res.json({success:false, message: "An error occured. Plese check your inputs."});
      }
      res.json({success:true, message: "New User Created!"});
      send_staff_registration_email(req, res, next);
    })
  }

  let send_staff_registration_email = function(req, res, next ){
    // setup email data with unicode symbols
    let mailOptions = {
        from: process.env.EMAIL_FROM, // sender address
        to: req.body.email,//req.body.email, // list of receivers
        subject: 'New User Account Confirmation', // Subject line
        text: 'Dear User\n An account has just been created for you on RS Edge.\n Kindly Logon unto the platform to access your account.\nRegards \nThe Russelsmith Team.', // plain text body
        html: '<p>Dear User, </p><p>An account has just been created for you on RS Edge.</p><p> Kindly Logon unto the platform to access your account..</p><br /><p>Regards </p><p>The Russelsmith Team.</p>', // plain text body
      };
    mailer.sendMail(mailOptions, res, next);
  }
  module.exports.getProfileDetails = function(req, res){
    User.findOne({_id:req.params.id}).select().exec(function(err, user){
        if(err){
          res.json({message: err});
          return;
        } 
        res.status(200).json(user); 
    })
  }