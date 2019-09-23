const express = require('express')
const nodemailer = require('nodemailer');
const sendgrid = require("@sendgrid/mail")
require('dotenv/config')

/*

sendgrid.setApiKey('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')
function sendMail(msg){
sendgrid.send(msg)
}
module.exports = sendMail*/


/*const transporter = nodemailer.createTransport("SMTP", {
        host: "mail.domain.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        auth: {
            user: "info@domain.com",
            pass: "password"
        },
        debug:true,
        tls: {
        rejectUnauthorized: false
        }
});
*/
const transporter = nodemailer.createTransport({
    host: 'mail.rolten.info',
    port: 465,
    secure:true,
    
    auth: {
      user: 'rolten@rolten.info',
      pass: '^ZC}J)nWQC80'
    },
tls: {
// do not fail on invalid certs
rejectUnauthorized: false
}
  });
  
  

  

  
  /*
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rolosistem@gmail.com',
      pass: '2894652.j'
    }
  });
  */

  
  function sendMail(mailOptions){
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}
module.exports = sendMail