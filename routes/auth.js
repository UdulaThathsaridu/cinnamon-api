const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = require("../middlewares/auth");
//require user models and require two fields name,email
const User = require("../models/User");

//routes


router.post("/register",async(req,res) => {
    //we need three things from our body
    const {name,email,password}=req.body;

    //check all the missing fields
    if(!name || !email || !password) 
    return res
      .status(400)//400=bad user input
      .json({error:`Please enter all the required fields. `});
   //name validation
   if(name.length > 25) return res
   .status(400)
   .json({error:"Name can only be less than 25 characters"});

   //email validation
   const emailReg = 
   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

   if(!emailReg.test(email)) 
   return res
     .status(400)
     .json({error:"Please enter a valid email address."});
   

     //validate password
     if(password.length <=6) 
     return res
     .status(400)
     .json({error:"Password must be at least 6 characters long."});
      
     //create model
     try{
        const doesUserAlraedyExist = await User.findOne({email});

        if(doesUserAlraedyExist)return res.status(400).json({error:`A User with that email [${doesUserAlraedyExist.email}] already exists`})
        //npm add bcrypt for hashed password
        const hashedPassword = await bcrypt.hash(password,12);
       const newUser = new User({name,email,password:hashedPassword});
    //save the user
    const result = await newUser.save();

    result._doc.password = undefined;

    return res.status(201).json({...result._doc});

    }catch(err){
        console.log(err);
        return res.status(500).json({ error:err.message});
    }
});

//login route

router.post("/login",async(req,res) => {

  const {email,password} = req.body;

  if(!email || !password) 
  return res
  .status(400)
  .json({error:"Please enter all the required fields"});

  //email validation
  const emailReg = 
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(!emailReg.test(email)) 
  return res
    .status(400)
    .json({error:"Please enter a valid email address."});
  

  try{
    const doesUserExist = await User.findOne({email});

    if(!doesUserExist) 
    return res
    .status(400)
    .json({error:"Invalid email or Password"});

  //if any user present
  const doesPasswordMatch = await bcrypt.compare(
    password,doesUserExist.password
    );

    if(!doesPasswordMatch) 
    return res
    .status(400)
    .json({error:"Invalid email or Password"});
    
    const payload = {_id:doesUserExist._id};

    const token = jwt.sign(payload , process.env.JWT_SECRET,
      {expiresIn:"1h"
    });
    const user = {...doesUserExist._doc,password:undefined};

    return res.status(200).json({token,user });

  }catch(err){
    console.log(err);
    return res.status(500).json({ error:err.message});
  }
});

router.get("/me",auth,async(req,res)=>{
  return res.status(200).json({...req.user._doc});

})

//use router

module.exports = router;