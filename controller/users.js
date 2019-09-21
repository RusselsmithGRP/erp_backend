var passport = require("passport");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Department = mongoose.model("Department");
// const User = require("../model/user");
var Vendor = mongoose.model("Vendor");
var mailer = require("../model/mailer");
var crypto = require("crypto");

module.exports.register = function(req, res, next) {
  var user = new User();
  let confirmationId = generateToken();
  user.email = req.body.email;
  user.role = req.body.role;
  user.created = new Date();
  user.confirmationId = confirmationId;
  user.setPassword(req.body.password);

  user.save(function(err) {
    if (err)
      return res.json({
        errorMsg: "An error occured while trying to register",
        errCode: err.code
      });
    else {
      var token;
      token = user.generateJwt();
      if (user.role === "vendor") {
        let vendor = new Vendor({
          user: user._id,
          general_info: { company_name: req.body.coy_name },
          status: "PENDING"
        });
        vendor.save(function(err, doc) {
          if (err) return next(err);
          // send_user_registration_email(confirmationId, req, res, next);
          qhse_vendor_reg_mail(req, res, doc);

          res.status(200).json({
            token: token
          });
        });
      } else {
        // send_user_registration_email(confirmationId, req, res, next);
        send_staff_reg_email(req, res);
      }
    }
  });
};

module.exports.importuser = function(req, res, next) {
  var user = new User();
  let confirmationId = generateToken();
  user.email = req.body.email;
  user.email = req.body.email;
  user.role = req.body.role;
  user.created = new Date();
  user.confirmationId = confirmationId;
  user.setPassword(req.body.password);
  user.save(function(err) {
    if (err) return res.json({ success: false, message: err.message });
    var token;
    token = user.generateJwt();
    if (user.role === "vendor") {
      let vendor = new Vendor({
        user: user._id,
        classes: req.body.classes,
        general_info: {
          company_name: req.body.coy_name,
          coy_email: req.body.email,
          contact_email: req.body.email,
          contact_name: req.body.contact_name,
          contact_phone: req.body.contact_phone,
          office_address: req.body.office_address,
          state: req.body.state,
          country: req.body.country,
          website: req.body.website,
          supplier_id: req.body.supplier_id
        },
        business_info: { product_related: req.body.product_related }
      });
      vendor.save(function(err, vendor) {
        if (err) return res.json({ success: false, message: err.message });
        // send_user_registration_email(confirmationId, req, res, next);
        qhse_vendor_reg_mail(req, res, vendor);
        vendor_success_reg_email(req, res);
        res.json({ success: true, message: "New Vendor Created" });
      });
    } else {
      send_user_registration_email(confirmationId, req, res, next);
    }
  });
};

// let send_user_registration_email = function(confirmationId, req, res, next) {
//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: process.env.EMAIL_FROM, // sender address
//     to: req.body.email, //req.body.email, // list of receivers
//     bcc: process.env.IAC_GROUP_EMAIL,
//     subject: "New Vendor Account Confirmation", // Subject line
//     text:
//       "Dear " +
//       req.body.coy_name +
//       '\n Thank you for creating an account on RS Edge, RusselSmith’s Vendor Management Platform.\n To continue the vendor registration, please click the link below: Confirmation Link: \n<a href="' +
//       process.env.PUBLIC_URL +
//       "/confirm/" +
//       confirmationId +
//       '">\n If you do not see a link, kindly copy out the text in the line above and paste into your browser.\nRegards \nThe Russelsmith Team.', // plain text body
//     html:
//       "<p>Dear " +
//       req.body.coy_name +
//       ', </p><p>Thank you for creating an account on RS Edge, RusselSmith’s Vendor Management Platform.</p><p> To continue the vendor registration, please click the link below: Confirmation Link: <a href="' +
//       process.env.PUBLIC_URL +
//       "/confirm/" +
//       confirmationId +
//       '">RS Edge</a></p><p> If you do not see a link, kindly copy out the text in the line above and paste into your browser.</p><br /><p>Regards </p><p>The Russelsmith Team.</p>' // plain text body
//   };
//   mailer.sendMail(mailOptions, res, next);
// };

/**
 * @author Idowu
 * @param {*} confirmationId
 * @param {*} req
 * @param {*} res
 * @summary Send Confirmation Notification to Vendor after successful registration
 */
const send_user_registration_email = (confirmationId, req, res) => {
  const msg = {
    to: req.body.email,
    from: process.env.EMAIL_FROM,
    // bcc: [
    //   process.env.IAC_GROUP_EMAIL,
    //   process.env.PROCUREMENT_EMAIL,
    //   process.env.QHSE_GROUP_EMAIL
    // ],
    subject: "New Vendor Account Confirmation",
    templateId: process.env.USER_REG_TEMPLATE_ID,
    dynamic_template_data: {
      subject: `New Vendor Account Confirmation`,
      company_name: req.body.coy_name,
      confirmLink: `${process.env.PUBLIC_URL}/confirm/${confirmationId}`,
      // confirmLink: `http://localhost:3000/users/confirmregistration/${confirmationId}`,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  mailer.sendMailer(msg, req, res);
};

// let send_email_reset_token = function(resetToken, req, res, next) {
//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: process.env.EMAIL_FROM, // sender address
//     to: req.body.email, //req.body.email, // list of receivers
//     bcc: process.env.IAC_GROUP_EMAIL,
//     subject: "Reset Your Password", // Subject line
//     text:
//       'A password request has just been initaited on your account! \n Please click the link below to reset your password. \n<a href="' +
//       process.env.PUBLIC_URL +
//       "/resetpassword/" +
//       resetToken +
//       '">RS Edge</a>  \n If this is not you, please kindly ignore this email.', // plain text body
//     html:
//       '<p>A password request has just been initaited on your account!</p><p> Please click the link below to reset your password. </p> <p> <a href="' +
//       process.env.PUBLIC_URL +
//       "/resetpassword/" +
//       resetToken +
//       '">RS Edge</a></p><p>If this is not you, please kindly ignore this email</p>' // plain text body
//   };
//   mailer.sendMail(mailOptions, res, next);
// };

/**
 * @author Idowu
 * @param {*} resetToken Token to initiate a password reset
 * @param {*} req
 * @param {*} res
 */
const send_email_reset_token = (resetToken, req, res) => {
  const msg = {
    to: req.body.email,
    from: process.env.EMAIL_FROM,
    bcc: process.env.IAC_GROUP_EMAIL,
    subject: `Reset Your Password`,
    templateId: process.env.RESET_TOKEN_TEMPLATE_ID,
    dynamic_template_data: {
      resetLink: `${process.env.PUBLIC_URL}/resetpassword/${resetToken}`,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  mailer.sendMailer(msg, req, res);
};

/**
 * @author Idowu
 * @summary Send Email notification to QHSE department when vendor submits registration form
 * @typedef {{ req: Request, res: Response }}
 */
const qhse_vendor_reg_mail = (req, res, doc) => {
  const msg = {
    to: process.env.QHSE_GROUP_EMAIL,
    from: process.env.EMAIL_FROM,
    bcc: ["lojefua@russelsmithgroup.com", "eokinedo@russelsmithgroup.com"],
    subject: "New Vendor Approval Required",
    templateId: process.env.QHSE_VENDOR_REGISTRATION_TEMPLATE_ID,
    dynamic_template_data: {
      subject: "New Vendor Approval Required",
      company_name: req.body.coy_name,
      redirect_link: `${process.env.PUBLIC_URL}/vendor/view/${doc._id}`,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };

  mailer.sendMailer(msg, req, res);
};

/**
 * @author Idowu
 * @summary Send Email To vendor when registration is complete
 */
const vendor_success_reg_email = (req, res) => {
  const msg = {
    to: req.body.email,
    from: process.env.EMAIL_FROM,
    subject: "Vendor Application Submitted Successfully",
    templateId: process.env.VENDOR_SUCCESS_REGISTRATION_TEMPLATE_ID,
    dynamic_template_data: {
      subject: "Vendor Application Submitted Successfully",
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };
  mailer.sendMailer(msg, req, res);
};

let generateToken = function() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

let isRsEmail = email => {
  return email.search("russelsmithgroup.com");
};

module.exports.login = function(req, res) {
  let passportMode;
  if (
    isRsEmail(req.body.email) >= 0 &&
    req.body.email != "procurement@russelsmithgroup.com" &&
    req.body.email != "iac@russelsmithgroup.com"
  ) {
    passportMode = "custom";
  } else {
    passportMode = "local";
  }
  passport.authenticate(passportMode, function(err, user, info) {
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a vendor is not verified
    if (user.role == "vendor" && user.emailVerified === false) {
      res.status(406);
      res.json({
        message:
          "your account is not verified! please log into your email and follow the link sent to you."
      });
      return;
    }
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        token: token,
        user: user
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports.index = function(req, res) {
  User.find({}).exec((err, doc) => {
    if (err) return res.send(err);
    res.send(doc);
  });
};

module.exports.view = function(req, res) {
  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User.findById(req.payload._id).exec(function(err, user) {
      res.status(200).json(user);
    });
  }
};

/**
 * @author Idowu
 * @summary changed the Query params for updateProfileData from req.body.id to req.body._id
 * @summary Destructured the `data` object to access all fields without any bother for model structure.
 * @param {*} req Sends a `Request` to the server
 * @param {*} res Returns a `Response` from the server with a `payload`
 * @summary Department/role updated
 *
 */
module.exports.updateProfileData = function(req, res) {
  let data = {
    ...req.body,
    updatedAt: Date.now()
  };
  User.findOneAndUpdate(
    { _id: req.body._id },
    { $set: data },
    { new: true },
    function(err, profileData) {
      if (err) {
        // next(err);
        res.send(err);
      } else {
        if (req.body.type === "hod") {
          Department.findOneAndUpdate(
            { slug: profileData.role },
            { $set: { hod: req.body._id } },
            { new: true },
            (err, doc) => {
              console.log(doc);
              if (err) throw err;
            }
          );
        }
        return res.send({
          success: true,
          message: "profile has been updated",
          profileData
        });
      }
    }
  );
};

module.exports.requestResetToken = function(req, res, next) {
  User.findOne({ email: req.body.email })
    .select()
    .exec(function(err, user) {
      if (err) {
        return res.json({ success: false, message: "error here" + err });
      } else {
        if (!user) {
          return res.json({
            success: false,
            message: "Password reset email has been sent to the email provided"
          });
        } else {
          let resetToken = generateToken();
          User.findOneAndUpdate(
            { email: req.body.email },
            { $set: { token: resetToken } },
            { new: true },
            (err, user) => {
              if (err) {
                res.send(err);
              }
              //res.json(user)
              send_email_reset_token(resetToken, req, res, next);
              res.status(200);
              res.json({
                success: true,
                message:
                  "Password reset email has been sent to the email provided!"
              });
            }
          );
        }
      }
    });
};

module.exports.resetThePassword = function(req, res) {
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  User.findOne({ token: req.params.token })
    .select()
    .exec(function(err, user) {
      if (err) {
        return res.json({ success: false, message: err });
      } else {
        if (!user) {
          return res.json({ success: false, message: "wrong token" });
        }
        if (password === confirmPassword && confirmPassword !== "") {
          user.setPassword(confirmPassword);
          user.save(function(err) {
            if (err) return next(err);
            return res.json({
              success: true,
              message: "password has been reset"
            });
          });
        } else {
          return res.json({
            success: false,
            message: "passwords does not match"
          });
        }
      }
    });
};

module.exports.changeYourPassword = function(req, res) {
  let oldPassword = req.body.oldPassword;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  User.findOne({ _id: req.body.id }, function(err, user) {
    if (user.validPassword(oldPassword)) {
      if (password === confirmPassword && confirmPassword !== "") {
        user.setPassword(confirmPassword);
        user.save(function(err) {
          if (err) return next(err);
          return res.json({
            success: true,
            message: "password has been reset"
          });
        });
      } else {
        return res.json({
          success: false,
          message: "new passwords do not match"
        });
      }
    } else {
      return res.json({
        success: false,
        message: "old password does not match"
      });
    }
  });
};

module.exports.findAllStaff = function(req, res) {
  User.find({ role: { $ne: "admin", $ne: "vendor" } })
    .sort("created")
    .exec(function(err, users) {
      if (err) {
        res.json({ message: err });
      }
    });
};

module.exports.confirmtoken = function(req, res) {
  User.findOne({ token: req.params.token })
    .select()
    .exec(function(err, user) {
      if (err) {
        res.json({ tokenState: false, message: err });
        return;
      } else {
        if (!user) {
          res.json({ tokenState: false });
          return;
        } else {
          res.json({ tokenState: true });
          return;
        }
      }
    });
};

module.exports.confirmRegistration = function(req, res) {
  console.log(req.params.token);
  User.findOne({ confirmationId: req.params.token })
    .select()
    .exec(function(err, user) {
      if (err) {
        res.json({ success: false, message: err.message });
        return;
      } else {
        if (user && user.emailVerified === false) {
          user.emailVerified = true;
          user.save(function(err) {
            if (err) return next(err);
            return res.json({
              success: true,
              message: "Thank you, registration is now complete"
            });
          });
        } else {
          res.json({
            success: false,
            message: "The confirmation link is invalid or expired."
          });
          return;
        }
      }
    });
};

module.exports.findOnlyStaff = function(req, res) {
  User.find({ type: "staff" })
    .sort({ created: -1 })
    .exec(function(err, users) {
      if (err) {
        res.json({ message: err });
        return;
      }
      res.status(200).json(users);
    });
};

module.exports.findManagers = (req, res) => {
  User.find({ type: "manager" })
    .sort({ created: -1 })
    .exec(function(err, users) {
      if (err) {
        res.json({ message: err });
        return;
      }
      // console.log(users);
      res.status(200).json(users);
    });
};
/* 
  module.exports.createNewUser = function(req, res, next){
    var user = new User();
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.eid = req.body.eid;
    user.role = req.body.role;
    user.department = req.body.department;
    user.type = req.body.type;
    user.created = new Date();
    let msg = "";
    user.save((err, r)=>{
      if(err) {
        switch(err.code){
          case 11000:
              msg = "Username already exist";
            break;
          default:
              msg = "Error saving user details";
            break;
        }
       return res.status(200).json({success:false, message: msg});
      }
      send_staff_registration_email(req, res, next);
      res.status(200).json({success:true, message: "New User Created!", user:{type: "staff"}});  
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
  } */
module.exports.getProfileDetails = function(req, res) {
  User.findOne({ _id: req.params.id }).exec(function(err, user) {
    if (err) {
      next(err);
    }
    res.status(200).json(user);
  });
};

module.exports.deleteUser = function(userId) {
  User.deleteOne({ _id: userId })
    .select()
    .exec(function(err, user) {
      if (err) return res.send(err);
      res.send({ message: "User deleted successfully" });
    });
};

module.exports.findAllStaff = function(req, res) {
  User.find({ role: { $ne: "admin", $ne: "vendor" } }).exec(function(
    err,
    users
  ) {
    if (err) {
      res.json({ message: err });
      return;
    }
    res.status(200).json(users);
  });
};

module.exports.findOnlyStaff = function(req, res) {
  User.find({ type: "staff" }).exec(function(err, users) {
    if (err) {
      res.json({ message: err });
      return;
    }
    res.status(200).json(users);
  });
};

/**
 * @author Idowu
 * @summary createNewUser logic has been refactored
 * @summary `save()` method now returns a promise instead of a callback
 * @summary `err` message was changed
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports.createNewUser = function(req, res) {
  let confirmationId = generateToken();
  const data = { ...req.body };
  const user = new User(data);
  user.confirmationId = confirmationId;

  user.save((err, doc) => {
    if (err) return res.send(err);

    res.send({
      success: true,
      message: "New User Created",
      user: { type: "staff" }
    });
    send_staff_reg_email(req, res);
  });

  // user
  //   .save()
  //   .then((err, doc) => {
  //     if (err) {
  //       return res.send(err);
  //     } else {
  //       res.json({
  //         success: true,
  //         message: "New User Created!",
  //         user: { type: "staff" }
  //       });
  //       send_staff_reg_email(req, res);
  //     }
  //     // if (doc.role === "vendor") {
  //     //   send_user_registration_email(confirmationId, req, res, next);
  //     // } else {
  //     //   send_staff_reg_email(req, res);
  //     // }
  //   })
  //   .catch(err => {
  //     res.json({
  //       success: false,
  //       message: `A user with email: "${req.body.email}" already exists.`
  //     });
  //   });
};

/**
 * @author Idowu
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @example msg = {
        to: req.body.email,
        from: process.env.EMAIL_FROM,
        subject: "Approval for purchase order",
        templateId: process.env.TEMPLATE_ID,
        dynamic_template_data: {
              subject: "Approval for Purchase order",
              name: req.body.username,
              sender_name: `Russelsmith Group.`,
              sender_address: "3, Swisstrade drive, Ikota-Lekki, Lagos."
        }
 */

const send_staff_reg_email = (req, res) => {
  const msg = {
    to: req.body.email,
    from: process.env.EMAIL_FROM,
    subject: `New User Account confirmation`,
    templateId: process.env.STAFF_REG_TEMPLATE_ID,
    dynamic_template_data: {
      subject: "New User Account Confirmation",
      email: req.body.email,
      name: req.body.lastname,
      sender_phone: "+234 706 900 0900",
      sender_address: "3, Swisstrade Drive, Ikota-Lekki, Lagos, Nigeria."
    }
  };

  mailer.sendMailer(msg, req, res);
};

// let send_staff_registration_email = function(req, res, next) {
//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: process.env.EMAIL_FROM, // sender address
//     to: req.body.email, //req.body.email, // list of receivers
//     subject: "New User Account Confirmation", // Subject line
//     text:
//       "Dear User\n An account has just been created for you on RS Edge.\n Kindly Logon unto the platform to access your account.\nRegards \nThe Russelsmith Team.", // plain text body
//     html:
//       "<p>Dear User, </p><p>An account has just been created for you on RS Edge.</p><p> Kindly Logon unto the platform to access your account..</p><br /><p>Regards </p><p>The Russelsmith Team.</p>" // plain text body
//   };
//   mailer.sendMail(mailOptions, res, next);
// };
module.exports.getProfileDetails = function(req, res) {
  User.findOne({ _id: req.params.id })
    .select()
    .exec(function(err, user) {
      if (err) {
        res.json({ message: err });
        return;
      }
      res.status(200).json(user);
    });
};

/**
 * @author Idowu
 * @param {req} Request req
 * @param {res} Response res
 * @param {next} Middleware next
 * @summary This function handles the update of logged in User's profile
 */
module.exports.updateUserProfile = (req, res, next) => {
  const updatedData = {
    ...req.body,
    updatedAt: Date.now()
  };

  User.findOneAndUpdate(
    { _id: req.body._id },
    { $set: updatedData },
    { new: true }
  ).exec((err, doc) => {
    if (err) return next(err);
    res.send({ message: "User Updated successfully", payload: doc });
  });
};

/**
 * @author Idowu
 * @description Delete Staff/User
 * @summary For API testing and future usage
 */
exports.deleteStaff = (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
    if (err)
      return res
        .status(400)
        .send({ success: false, msg: "Failure deleting user" });
    res.send({ success: true, doc });
  });
};
