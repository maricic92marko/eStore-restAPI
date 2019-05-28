const express = require('express')
const mysql = require('mysql')
const router = express.Router()

router.get('/messages', (req,res) =>{
    console.log('some messages')
    res.end()
})

router.get('/users',(req,res) =>{
    const connection = connection1()
    const queryStr ='select * from users'

    connection.query(queryStr,(err,rows,fields) =>{
        if (err) {
            console.log('error hapned')
            res.sendStatus(500)
            res.end()
            return
            //throw err
        }
        res.json(rows)

        })
    })

    router.get('/user/:id', (req,res) => {
        // console.log('user with id'+ req.params.id)
         const connection =  connection1()
         const userId = req.params.id
         const queryStr ='select * from users where id = ?'
     
         connection.query(queryStr,[userId],(err,rows,fields) =>{
             if (err) {
                 console.log('error hapned')
                 res.sendStatus(500)
                 res.end()
                 return
                 //throw err
             }
             const users = rows.map((row) => {
                 return {firstName: row.first_name}
             })
             res.json(rows)
         })
     
     })

     router.post('/user_create', (req,res) => {
    
        console.log('create user')
        console.log('create user'+     req.body.fname
        )
    
        const queryStr ='insert into users (first_name,last_name)'
        +'values(?,?)'
        connection1().query(queryStr,[req.body.fname,req.body.lname],(err,res,fields) =>{        
            if (err) {
            console.log('failed to insert users '+err)
            res.sendStatus(500)
            return
        }
        console.log('sucess')
    })
    })

    router.get("/",(req, res) => {
        console.log('responding to root route')
        res.send("hello from ROOOT")
    })

    const pool = mysql.createPool({
        connectionLimit: 10,
        host:'localhost',
        user:'root',
        database:'lbta_mysql'
    })

     const connection1 = () => { 
       // pool.query 
        return pool
    }

module.exports = router