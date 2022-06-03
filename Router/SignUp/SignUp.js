const { Route } = require('express');
const express=require('express');
const {GenerateToken}=require('../Authentication/Authentication')
const Router=express.Router();
const {genHash}=require('../Encryption/Bcrypt')
const { UserModel }=require('../Mongoose/Connection');

Router.use(express.json());
const Response=(status,duplicate,msg)=>{
	return {
		"Success":status,
        "Errors":{
            "Duplicate":duplicate
        },
        "Massage":msg,
	}
};



Router.post('/',async(req,res,next)=>{
    try{
        let data=req.body;
    if(!data.fullname | !data.username | !data.email | !data.phone | !data.password | !data.gender) return res.json(Response(0,0,'Please provide all credential.'));
    let userExist=await UserModel.exists({$or:[{Username:data.username},{Email:data.email}]});
    if(userExist!=null) return res.json(Response(0,1,'Another account exists with this username or email.'));
    let NewUser=await new UserModel({
        Fullname:data.fullname,
        Username:data.username,
        Email:data.email,
        Phone:data.phone,
        Password:await genHash(data.password),
        Gender:data.gender,
        Role:'User'
    })
    NewUser.save()
    .then(result=>{
        res.json(Response(1,0,'Account Created.'));
    })
    .catch((err)=>{
        res.json(Response(0,0,'Internal Server error. We will get back soon.'));
    })
    }
    catch(err){
        res.sendStatus(400);
    }
})

module.exports=Router;
