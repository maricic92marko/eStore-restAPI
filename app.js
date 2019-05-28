const express = require('express')
const app= express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
app.use(morgan('short'))








//lets see how to start refactoring with router
const router = require('./routes/user.js')

app.use(router)





app.listen(3002, () =>{
    console.log('listeninggggg on 3002')
})
