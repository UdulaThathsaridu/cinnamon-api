//reqquire mongoose package
const mongoose = require('mongoose');

//define userscheama
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required."],
    },
    email:{
        type:String,
        required:[true,"Email is required."],
    },
    password:{
        type:String,
        required:[true,"Password is required."],
    },
});

//create model

const User = new mongoose.model("User",UserSchema);

module.exports = User;
