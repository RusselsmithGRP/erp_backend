"use strict";
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
/**
 * @author Idowu
 *
 */
let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  // requireTLS: true,
  auth: {
    user: "rssmtp@russelsmithgroup.com",
    pass: "Nigeria*2"
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: "7000",
  greetingTimeout: "7000",
  socketTimeout: 7000
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
