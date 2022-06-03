const { json } = require("express/lib/response");
const { default: mongoose } = require("mongoose");
const UserModel=require('../../DbModels/UserModel')
const Product=require('../../DbModels/ProductModel')

const url = "mongodb+srv://monir:Lo94EXOinI5Wn5fG@cluster1.2mata.mongodb.net/Monir";

mongoose.connect(url,{
  useUnifiedTopology:true,
  useNewUrlParser:true,
})
let connection=mongoose.connection;
connection.on('connected',()=>{
  console.log('[+] Database connection established...');
  connection.on('disconnected',()=>{
    console.log('[-] Database connection lost...')
  })
})

module.exports={
    UserModel,
    Product
}
