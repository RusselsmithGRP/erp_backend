"use strict";
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
/**
 * @author Idowu
 *
 */
let transporter = nodemailer.createTransport({
  service: "outlook",
  host: "smtp.office365.com",
  // host: "russelsmithgroup-com.mail.protection.outlook.com",
  // port: 587,
  port: 587,
  secure: false,

  requireTLS: true,
  auth: {
    user: "rssmtp@russelsmithgroup.com",
    // pass: "Nigeria*2"
    pass: "Nigeria*1"
  },
  tls: { ciphers: "SSLv3" }
});

/* var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: '######',
           pass: '######3'
       },
    tls:{
        rejectUnauthorized: false
        cipers: 'SSLv3'
    }
   }); */

exports.sendMail = (mailOptions, res, next) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      next(error);
      console.log(error); //console.log(error);
    } else {
      console.log("Message %s sent: %s", info.messageId, info.response);
      transporter.close();
    }
    /// next(('Message %s sent: %s', info.messageId, info.response));
  });
};
