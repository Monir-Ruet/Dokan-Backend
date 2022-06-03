const jwt=require('jsonwebtoken')
const { UserModel }=require('../Mongoose/Connection');

function GenerateToken(payload) {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2592000s' });
}
function isAuthorized(req,res,next){
	let token=req.get('Authorization')
	if(!token) return res.send({});
	token=token.split(' ')[1];
	jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,data)=>{
		if(err) {
			return res.send({});
		}
		let result=UserModel.findOne({"Username":data.username})
		.then((result)=>{

			req.payload=result.Username;
			req.role=result.Role;
			next();
		})
		.catch((err)=>{
			return res.send({});
		})
	})
}

module.exports={
    GenerateToken,
    isAuthorized
}
