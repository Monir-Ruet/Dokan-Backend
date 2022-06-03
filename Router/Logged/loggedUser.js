const { Route } = require('express');
const express=require('express');
const {isAuthorized}=require('../Authentication/Authentication')
const Router=express.Router();
const { UserModel }=require('../Mongoose/Connection');
const bcrypt=require('bcrypt');
Router.use(express.json());

Router.get('/',isAuthorized,async(req,res)=>{
  if(!req.payload) return res.json({});
  try{
    const user = await UserModel.findOne({ Username: req.payload });
		if (user) {
			res.json(user);
		  } else {
			res.json({});
	  }
  }catch (error) {
		res.sendStatus(400)
	}

})

module.exports=Router
