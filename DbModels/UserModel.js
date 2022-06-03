const mongoose=require('mongoose')

const User=new mongoose.Schema({
    Fullname:{
        type:String,
        minlength:3,
        required:true
    },
    Username:{
        type:String,
        minlength:5,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Phone:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Gender:{
        type:String,
        enum:['Male','Female','Others'],
        required:true
    },
    Role:{
      type:String,
      require:true
    }
})

module.exports=mongoose.model('User',User);