const mongoose = require("mongoose");
const Joi = require("joi");

// Define mail schema
const mailSchema = new mongoose.Schema({
  supplierBankDetails: {
    type: String,
    required: [true, "Supplier bank details are required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  deadlineDate: {
    type: Date,
    required: [true, "Deadline date is required"],
  },
  createdAt: { type: Date, default: Date.now },
});

// Create model
const Mail = mongoose.model("PaymentMailSupp", mailSchema);

// Validation function
const validateMail = (data) => {
  const schema = Joi.object({
    supplierBankDetails: Joi.string().required(),
    amount: Joi.number().required(),
    deadlineDate: Joi.date().required(),
  });
  return schema.validate(data);
};

module.exports = {
  Mail,
  validateMail,
};