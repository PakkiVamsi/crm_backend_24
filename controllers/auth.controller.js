const User= require('../models/user.model');
const bcrypt = require('bcrypt');
const constants=require('../utils/constants');
const jwt= require('jsonwebtoken');
const authConfig = require('../configs/auth.config');

var signUp =async (req,res)=>{

    var userStatus= req.body.userStatus;
    if(req.body.userType== undefined || req.body.userType ==constants.userTypes.customer){
        if(userStatus == undefined )userStatus =constants.userTypes.approved;
    }
    else {
        if(userStatus == undefined )userStatus =constants.userTypes.pending;
    }


    const userObj= {
      name:req.body.name,
      userId:req.body.userId,
      password:bcrypt.hashSync(req.body.password,8),
      email:req.body.email,
      userType:req.body.userType,
      userStatus:userStatus
    }
    try{
      const userCreated= await User.create(userObj);
      console.log("User created successfully");
      res.status(201).send({message:"User Registered Successfully ",Details:userCreated});
    }
    catch(err){
      console.error("Error while creating new user");
      res.status(500).send({message:"some internal error"});
    }

}

var login =async (req,res)=>{
    try{
      var user= await User.find({userId:req.body.userId});
      console.log(user);
      console.log(user[0].password ,user[0].userId);
      if(user[0]){
        if(user[0].userStatus != constants.userStatus.approved){
            return res.status(200).send({message : "Can't allow the login as the User is still not approved"})
        }
        else if(bcrypt.compareSync(req.body.password,user[0].password)){
           const accessToken = jwt.sign({id: user[0].userId },authConfig.secret ,{expiresIn:'10d'});
           console.log(user);
           user[0]._doc.token=accessToken;
           res.status(201).send({message:"Logged in Successfully",Details:user[0]});
        }
        else{
           res.status(201).send({message:"Wrong password"});
        }
      }
      else{
          res.status(201).send({message:"Invalid Details"});
      }
    }
    catch(err){
      console.error("Error while creating new user");
      res.status(500).send({message:"some internal error"});
    }

}


module.exports={signUp,login};
