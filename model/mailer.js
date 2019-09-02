"use strict";
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// create reusable transporter object using the default SMTP transport
/**
 * @author Idowu
 *
 */
let transporter = nodemailer.createTransport({
  service: "outlook",
  host: "smtp.office365.com",
  // host: "russelsmithgroup-com.mail.protection.outlook.com",
  port: 587,
  secure: false,
  tls: {
    rejectUnauthorized: false,
    ciphers: "SSLv3"
  },
  requireTLS: true,
  auth: {
    user: "rssmtp@russelsmithgroup.com",
    pass: "Nigeria*2"
  }
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

/**
 * @author Idowu
 * @package `Sendgrid`
 * @summary Using Sendgrid mailing services to deliver email notifications
 * @template `msg`
 * 
 * =============
 * msg = {
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
 * ===============
 */

exports.sendMailer = (msg, req, res) => {
  sgMail.send(msg, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log({
      result,
      msg: `Email was sent to ${req.body.email}`
    });
  });
};
