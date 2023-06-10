const User = require('../model/userModel')
const bcrypt = require('bcrypt')
module.exports.register = async (req,res,next)=>{
 try{
    const {username,pwd} = req.body
    // console.log(req.body)
    const Usernamecheck = await User.findOne({username})
    if(Usernamecheck){
      // console.log("User exists")
      return res.json({msg:"Username already exists",status:false}).status(404);
    }
    const hashPwd = await bcrypt.hash(pwd,10);
    const user = await User.create({
     username,password:hashPwd
    });
    // console.log(user)
    delete user.password;
    return res.json({msg:"Registration Successful",status:true,user}).status(200)
 }
 catch(ex){
    next(ex)
 }
}

module.exports.login = async (req,res,next)=>{
    try{
       const {username,pwd} = req.body
      //  console.log(req.body)
       const user = await User.findOne({username})
       if(!user){
        // console.log("User doesn't exists")
        return res.json({msg:"Username doesn't exists",status:false}).status(500);
      }
      const isPWd = await bcrypt.compare(pwd,user.password)
       if(!isPWd){
        //  console.log("Wrong pwd or USer")
         return res.json({msg:"Incorrect Username or Password",status:false}).status(500);
       }
      //  console.log(user)
       delete user.password;
       return res.json({msg:"login Successful",status:true,user}).status(200)
    }
    catch(ex){
       next(ex)
    }
   }

   module.exports.setAvatar = async (req, res, next) => {
      try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(
          userId,
          {
            isAvatarImageSet: true,
            avatarImage,
          },
          { new: true }
        );
        return res.json({
          isSet: userData.isAvatarImageSet,
          image: userData.avatarImage,
        });
      } catch (ex) {
        next(ex);
      }
    };