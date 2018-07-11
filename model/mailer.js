"use strict";
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
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

exports.sendMail = (mailOptions, res)=>{
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.send(error);//console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
       return res.send(('Message %s sent: %s', info.messageId, info.response));
    });
}