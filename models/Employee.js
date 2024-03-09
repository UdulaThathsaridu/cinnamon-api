const mongoose = require("mongoose");
const Joi = require('joi');
const EmployeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required."]
    },
    address:{
        type:String,
        required:[true,"address is required."]
    },
    email:{
        type:String,
        required:[true,"email is required."]
    },
    phone:{
        type:Number,
        required:[true,"Phone number is required."]
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
});

const Employee = mongoose.model("Employee",EmployeeSchema);

const validateEmployee = data => {

    const schema = Joi.object({
        name:Joi.string().min(4).max(50).required(),
        address:Joi.string().min(4).max(100).required(),
        email:Joi.string().email().required(),
        phone:Joi.number().min(7).max(10000000000).required(),
        
    });
    return schema.validate(data);
}
module.exports = {
    validateEmployee,
    Employee,
};
