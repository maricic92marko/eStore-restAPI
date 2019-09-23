
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
const express = require('express')
const app= express()
const bodyParser = require('body-parser')
const customer_app_routes = require('./routes/customer_shop_app_routes')
require('dotenv/config')
  
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json()); 
  
  app.use(function (req, res, next) {
    let acces_url = [process.env.acces_url]
 
    // Website you wish to allow to connect
    if(1===1)
{        
  res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  }
    else{
      res.end();
    }
});

//lets see how to start refactoring with router
app.use(customer_app_routes)
const PORThttp = process.env.PORT || 5000
const PORThttps = process.env.PORT || 5001

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


httpServer.listen(PORThttp);
httpsServer.listen(PORThttps);
 