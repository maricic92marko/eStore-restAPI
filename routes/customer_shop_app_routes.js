const express = require('express')
const mysql = require('mysql')
const router = express.Router()
const sendMail = require('../mailer/sendmail')

const pool = mysql.createPool({
    connectionLimit: 15,
    host:'localhost',
    user:'root',
    database:'lbta_mysql'
})
 const getConnection = () => { 
    return pool
}



router.get('/initial_state',(req,res)=>{
    const queryStr = 'call sp_get_initial_app_state()'
    getConnection().query(queryStr,(err,rows,fields)=>{
        if (err) {
            res.sendStatus(500)
            res.end()
            return
        }
        else{
            getConnection().query('call sp_store_info()',(err,rows1,fields) =>{
                if (err) {
                    console.log(err)
                    return
                }
                else{
                    const result = {classes:rows[0],products:rows[1],slider_images:rows[2],store_info : rows1[0][0] }    
                    res.json(result)
                    res.end()    
                }
            })
        }
    })
})

router.get('/products', (req,res) =>{
    const connection =  getConnection()
    const queryStr ='call sp_get_all_products()'
    connection.query(queryStr,(err,rows,fields) =>{
        if (err) {
            res.sendStatus(500)
            res.end()
            return
        }
        else{

            res.json(rows[0])
            res.end()
        }
    })
})

router.post('/product_classes',(req,res) => {
    const queryStr = 'call sp_get_product_classes()'
    getConnection().query(queryStr,(err,rows,fields)=>{
        if (err) {
            res.sendStatus(500)
            res.end()
            return
        }
        else{
            res.json(rows)
            res.end()
        }
    })
})

router.post('/createorder', (req,res) => {
    let  mailHtml =''
    const data = JSON.parse(JSON.stringify(req.body))
    let last_order = 0
    let uuid = ''
    const email = data.order.email
    const Firstname = data.order.Firstname
    const Lastname = data.order.Lastname
    const PravnoLice = data.order.PravnoLice
    const phone = data.order.phone
    const Grad = data.order.Grad
    const Ulica = data.order.Ulica
    const Drzava = data.order.Drzava

    let store_mail;
    let store_name;
    let store_address;
    let store_phone;
    let store_delivery_company;

    getConnection().query('call sp_store_info()',(err,rows,fields) =>{
        if (err) {
            console.log(err)
            return
        }
        else{

            store_mail = rows[0][0].store_mail;
            store_name = rows[0][0].store_name;
            store_phone = rows[0][0].store_phone;
            store_address = rows[0][0].store_address;
            store_delivery_company = rows[0][0].store_delivery_company;

        }
    })

    getConnection().query('call sp_get_last_orderid() ',(err,rows,fields) =>{        
        if (err) {
         
            res.sendStatus(500)
            return
        }
        rows[0].map(item => {
            last_order = item.last_order +1,
            uuid = item.uuid
        })
 
        let queryStr =`call sp_create_orders (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        const itemdata = data.order.order_items_attributes
        for (let index = 0; index < itemdata.length; index++) {
            const element = itemdata[index];
            let product_id =element.product_id
            let product_quantity =element.qty

            let duzina = element.duzina
            let sirina = element.sirina
            let metar = element.metar

            getConnection().query(queryStr,
                [last_order,product_id,product_quantity,duzina,
                    sirina,
                    metar,                    
                    Firstname,
                    Lastname,
                    PravnoLice,
                    phone,
                    Grad,
                    Ulica,
                    Drzava,email,uuid],
                (err,rows,fields) =>{        
                if (err) {
                console.log(err)
                    return
                }
                if(index  === itemdata.length -1)
                {
                    queryStr ='call  sp_build_mail(?,?,?)'
                    getConnection().query(queryStr,[uuid,last_order,email],(err,rows,fields) =>{
                        if (err) {

                            res.sendStatus(500)
                            res.end()
                            return
                        }
                        else{
                            mailHtml = rows[0][0].mailHtml
                        } 

                        let mailOptions = {
                            from: store_mail,
                            to: [email,store_mail],
                            subject: store_name,
                            text: 'Rolo Sistem',
                            html:mailHtml
                        };


                        sendMail(mailOptions)
                    })
                }
            })
        }
    }) 
    const responseText = "Uspešno kreirana porudžbina." 
    res.json(JSON.stringify(responseText)) 
})

router.get('/cancel_order',(req,res)=>{
   
    const connection =  getConnection()
    const queryStr ='call sp_cancel_order(?)'
    const uuid = req.query.uuid
    const email = req.query.email

    let store_mail;
    let store_name;
    let store_address;
    let store_phone;
    let store_delivery_company;

    getConnection().query('call sp_store_info()',(err,rows,fields) =>{
        if (err) {
            console.log(err)

            return
        }
        else{

            store_mail = rows[0][0].store_mail;
            store_name = rows[0][0].store_name;
            store_phone = rows[0][0].store_phone;
            store_address = rows[0][0].store_address;
            store_delivery_company = rows[0][0].store_delivery_company;



    connection.query(queryStr,[uuid],(err,rows,fields) =>{
        if (err) {
            res.sendStatus(500)
            res.end()
            return
        }
        else{

            const storno_result = rows[0][0].result
            const msg = rows[0][0].msg
            const mailText = rows[0][0].mailText
 
            if(storno_result === 1)
            {
            let mailOptions = {
                from: store_mail,
                to: [email,store_mail],
                subject: store_name,
                text: mailText
               
            };
            sendMail(mailOptions)
            res.json({result :msg})
        }
        else{
            res.json({result :msg})
        }

        }
        })
    }
    })
})


router.get('/search_products',(req,res)=>{
     
    const queryStr ='call sp_search_products(?) '

    const search_str = req.query.search_str
    getConnection().query(queryStr,[search_str],(err,rows,fields) =>{
        if (err) {
            res.sendStatus(500)
            res.end()
            return
        }
        else{
            res.json(JSON.stringify(rows[0]))
            res.end()
        }
    })
})

 
    router.get("/",(req, res) => {
        console.log('responding to root route')
        res.send("hello from ROOOT")        
    })



module.exports = router