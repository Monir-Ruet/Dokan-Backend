const { json } = require("express/lib/response");
const { default: mongoose } = require("mongoose");
const UserModel=require('../../DbModels/UserModel')
const Product=require('../../DbModels/ProductModel')

const url = "mongodb+srv://monir:Lo94EXOinI5Wn5fG@cluster1.2mata.mongodb.net/Monir";

mongoose.connect(url,{
  useUnifiedTopology:true,
  useNewUrlParser:true,
}).then(console.log("Connected to mongodb"))
  .catch((err)=>{
    console.log(err)
  })



module.exports={
    UserModel,
    Product
}
