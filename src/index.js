/**
 * @author      : Monir (monir81.mk@gmail.com)
 * @created     : Wednesday Mar 30, 2022 18:21:29 +06
 */

"use strict"
require('dotenv').config()
const express=require('express');
const cors=require('cors')
const app=express();
const signin=require('../Router/SignIn/SignIn');
const Product=require('../Router/Product/Product.js')
const singup=require('../Router/SignUp/SignUp')
const LoggedUser=require('../Router/Logged/loggedUser')
app.listen(process.env.PORT || 5000.,()=>{
  console.log("Server Running")
});

// Middlewares
app.use(cors())
app.use('/products',Product)
app.use('/login',signin)
app.use('/signup',singup)
app.use('/loggedUser',LoggedUser);

app.get('/',(req,res)=>{
  res.send("This is the dokan Backend");
})
app.use((err, req, res, next) => {
  if(err instanceof SyntaxError && err.status===400 && 'body' in err) return res.status(400).send({Status:400,Message:"Bad Request"});
  next();
})

