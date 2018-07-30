"use strict";
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
/* let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'assetwise@russelsmithgroup.com',
        pass: 'Nigeria*1'
    },
    tls: { ciphers: 'SSLv3' }
});
 */
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'kolawole.abobade@gmail.com',
           pass: 'Idrisaloma01'
       },
    tls:{
        rejectUnauthorized: false
    }
   });

exports.sendMail = (mailOptions, res, next)=>{
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);//console.log(error);
        }else{
            console.log('Message %s sent: %s', info.messageId, info.response);
        }
       /// next(('Message %s sent: %s', info.messageId, info.response));
    });
}