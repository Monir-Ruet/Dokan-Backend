const mongoose=require('mongoose')

const product=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Code:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true
    },
    Price:{
        type:Number,
        required:true
    },
    Description:String,
    ImageUrl:String,
    // IsBestAchived:Boolean,
    Origin:{
        type:String,
        required:true
    },
    CreatedDate:Date

})

module.exports=mongoose.model('Product',product);