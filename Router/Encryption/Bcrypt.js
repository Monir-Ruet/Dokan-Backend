const bcrypt=require('bcrypt');

let genHash=async(data)=>{
    let h=await bcrypt.hash(data, 12);
    return h;
}

module.exports={
    genHash
}