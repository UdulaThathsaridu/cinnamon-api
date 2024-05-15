const mongoose = require('mongoose');
const Joi = require('joi');

// Define mail schema
const mailSchema = new mongoose.Schema({
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    productName: {
        type: String,
        required: [true, "Product name is required"],
    },
    productQuantity: {
        type: Number,
        required: [true, "Product quantity is required"],
    },
    pickUpDate: {
        type: Date,
        required: [true, "Pick up date is required"],
    },
    pickUpTime: {
        type: String,
        required: [true, "Pick up time is required"],
    },
    createdAt: { type: Date, default: Date.now }
});

// Create model
const Mail = mongoose.model("TransportMailSupp", mailSchema);

// Validation function
const validateMail = (data) => {
    const schema = Joi.object({
        address: Joi.string().required(),
        productName: Joi.string().required(),
        productQuantity: Joi.number().required(),
        pickUpDate: Joi.date().required(),
        pickUpTime: Joi.string().required(),
    });
    return schema.validate(data);
}

module.exports = {
    Mail,
    validateMail
};
