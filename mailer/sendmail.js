const express = require('express')
const sendgrid = require("@sendgrid/mail")
require('dotenv/config')

sendgrid.setApiKey(process.env.SGKEY)
function sendMail(msg){
sendgrid.send(msg)
}
module.exports = sendMail

