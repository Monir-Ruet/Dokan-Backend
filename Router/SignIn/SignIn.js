const { Route } = require('express');
const express=require('express');
const {GenerateToken}=require('../Authentication/Authentication')
const Router=express.Router();
const { UserModel }=require('../Mongoose/Connection');
const bcrypt=require('bcrypt');
Router.use(express.json());
const Response=(status,token,Message,name,username,email,role)=>{
	return {
		"LoggedIn":status,
		"Name":name,
		"Email":email,
		"Message":Message,
		"Username":username,
		"Token":token,
    "Role":role
	}
}

Router.post('/',async(req,res,next)=>{
	let data=req.body;
	if(!data.username || !data.password) return res.json(Response(0,'','Please enter all credential','','',''));

	try {
		const user = await UserModel.findOne({ Username: data.username });
		if (user) {
		  const cmp = await bcrypt.compare(data.password, user.Password);
		  if (cmp) {
			res.json(Response(true,GenerateToken({"username":data.username}),'Authentication Successfull',user.Fullname,user.Username,user.Email,user.Role));
		  } else {
			res.send(Response(false,'','Wrong username or password','','','',''));
		  }
		} else {
			res.send(Response(false,'','Wrong username or password','','','',''));
		}
	  } catch (err) {
      console.log(err);
		res.send("Internal Server error Occured");
	  }
})

module.exports=Router;
