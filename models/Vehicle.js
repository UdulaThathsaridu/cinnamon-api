const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');


//define vehicleSchemanpm

const vehicleSchema = new mongoose.Schema({
    vehicle:{
        type:String,
        emum:['van','car','truck','lorry'],
        optional:[true,"Vehicle is required"],
    },
    model:{
        type:String,
        required:[true,"Model is required"],
    },
    status: {
        type: String,
        enum: ['good', 'bad'], // Define enum for status
        required: [true, "Status is required"],
        
    },
    last_inspection:{
        type:Date,
        required:[true,"Last Inspection is required"],
    },
    next_inspection:{
        type:Date,
        required:[true,"Next Inspection is required"],
    },
    createdAt: { type: Date }
});

//create model

const Vehicle = new mongoose.model("Vehicle",vehicleSchema);

const validateVehicle = data => {

    const schema = Joi.object({
        vehicle:Joi.string().valid('van','car','truck','lorry').required(),
        model:Joi.string().required(),
        status: Joi.string().valid('good', 'bad').required(), // Validate status with enum values
       last_inspection:Joi.date().required(),
       next_inspection:Joi.date().required(),
    })
    return schema.validate(data);

}

module.exports = {
    validateVehicle,
    Vehicle,
}
