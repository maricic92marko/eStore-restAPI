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
    if(req.headers.origin &&  acces_url[0].indexOf(req.headers.origin) > -1)
{        

  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

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
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
})
