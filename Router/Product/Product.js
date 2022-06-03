const express=require('express');
const router=express.Router();
const bodyParser= require('body-parser')
const multer  = require('multer')
const path =require('path')
const fs=require('fs')
const { isAuthorized } =require('../Authentication/Authentication')
const { Product }=require('../Mongoose/Connection');
router.use(express.json())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Image')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})

router.use('/image',express.static('./Image'));


const upload = multer({ 
  storage: storage ,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  },
  limits:{
    fileSize: 1024 * 1024
  }
})

const ResponseMassage=(status,duplicate,massage)=>{
  return {
    status,
    duplicate,
    massage
  };
}

router.post('/upload',upload.single('Image'),(req,res)=>{
  const file=req.file;
  if(file!=null){
    res.send({
      status:true,
      filename:file.filename,
    })
  }
  else return res.send({status:false});
})

let deleteFile=(path)=>{
  fs.unlinkSync(path);
}
router.post('/add',upload.single('Image'),async(req,res)=>{
  const file=req.file;
  if(!file) return res.send("Please provide a image");
  const ProductInfo=req.body;
  if(!ProductInfo.Name || !ProductInfo.Code | !ProductInfo.Price | !ProductInfo.Category){
    deleteFile(file.path);
    return res.send(ResponseMassage(0,0,'Please provide proper credentials'));
  }
  if(await Product.exists({Code:ProductInfo.Code})!=null) {
    deleteFile(file.path);
    return res.send(ResponseMassage(0,1,'Already exits in database'));
  }
  const ProductModel=await new Product({
    Name:ProductInfo.Name,
    Code:ProductInfo.Code,
    Category:ProductInfo.Category,
    Price:ProductInfo.Price,
    Description:ProductInfo.Description,
    ImageUrl:file.filename,
    Origin:ProductInfo.Origin,
    CreatedDate:Date.now()
  })

  ProductModel.save()
  .then((result)=>{
    res.send(ResponseMassage(1,0,'New Product added'));
  })
  .catch((err)=>{
    ResponseMassage(0,0,'Internal Server Error');
  })
})
router.put('/update',isAuthorized, async(req,res)=>{
  try{
    Product.findOneAndUpdate({"Code":req.body.Code}, req.body)
    .then((result)=>{
      if(result==null) throw err;
      return res.json({"Status":1,"Message":"Information updated"});
    })
    .catch((err)=>{
      return res.json({"Status":0,"Message":"Error in updating"});
    })
  }catch(err){
    return res.json({"Status":0,"Message":"Internal Server Error"});
  }
})
router.delete('/delete/:id',isAuthorized,async(req,res)=>{
  if(req.role!='Admin') return res.json({Status:0,Message:"Insufficient Access."})
  try{
    const result=await Product.deleteOne({"Code":req.params.id});
    if(result.deletedCount) res.json({"Status":1,"Message":"Deleted"});
    else{
      return res.json({"Status":0,"Message":"Product not found"});
    }
  }catch{
    res.sendStatus(500);
  }

})
router.get('/find/:id',async(req,res)=>{
  try{
    const result=await Product.findOne({"Code":req.params.id});
    if(result!=null) res.send(result);
    else res.send({});
  }catch{
    res.sendStatus(500);
  }
})
router.post('/get',express.json(),async(req,res)=>{
  let filter={}
  if(!req.query.page || !req.body || typeof(req.body)!='object') return res.sendStatus(400);
  let f=req.body;
  if(!f.selectedCategory) f['selectedCategory']=[];
  if(!f.selectedCategory.length) f.selectedCategory=[{}];
  let from=parseInt(f.fromPrice),to=parseInt(f.toPrice);
  if(!from) from=0;
  if(!to) to=Infinity;
  from--,to++;
  if(req.query.sort && req.query.order){
    let m={}
    m[undefined]=1;
    m['asc']=m['ASC']=1;
    m['desc']=m['DESC']=-1;
    filter[req.query.sort]=m[req.query.order]
  }
  filter['CreatedDate']=-1;
  try{
    let count=await Product.count({$and:[{$or:f.selectedCategory},{$and:[{Price:{$gt:from}},{Price:{$lt:to}}]}]});
    let result=await Product.find({$and:[{$or:f.selectedCategory},{$and:[{Price:{$gt:from}},{Price:{$lt:to}}]}]}).skip((req.query.page-1)*10).limit(10).sort(filter);

    if(result.length) res.send({"items":result,"total_count":count});
    else res.send([]);
  }catch(err){
    res.sendStatus(500);
  }
})
router.get('/get',async(req,res)=>{
  let filter={}
  if(!req.query.page) return res.sendStatus(400);
  if(req.query.sort && req.query.order){
    let m={}
    m[undefined]=1;
    m['asc']=m['ASC']=1;
    m['desc']=m['DESC']=-1;
    filter[req.query.sort]=m[req.query.order]
  }
  filter['CreatedDate']=-1;
  try{
    let count=await Product.count();
    let result=await Product.find().skip((req.query.page-1)*10).limit(10).sort(filter);
    if(result.length) res.send({"items":result,"total_count":count});
    else res.send([]);
  }catch(err){
    res.sendStatus(500);
  }
})

module.exports=router;
