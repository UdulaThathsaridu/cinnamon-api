const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');


//define productSchema

const productSchema = new mongoose.Schema({
    id:{
        type:String,
        required:[true,"ID is required"],
    },
    name:{
        type:String,
        required:[true,"Name is required"],
    },
    productId:{
        type:String,
        required:[true,"productID is required"],
    },
    quantity:{
        type:Number,
        required:[true,"quantity is required"],
    },
    price:{
        type:String,
        required:[true,"price is required"],
    },
    description:{
        type:String,
        required:[true,"Description is required"],
    },
  
    createdAt: { type: Date }
   
}

);

//create model

const Product = new mongoose.model("Product",productSchema);

const validateProduct = data => {

    const schema = Joi.object({
        id:Joi.string().optional(),
        name:Joi.string().required(),
        productId:Joi.string().required(),
        quantity:Joi.number().required(),
        price:Joi.string().required(),
        description:Joi.string().required(),
    })
    
    return schema.validate(data);

}

module.exports = {
    validateProduct,
    Product,
}
