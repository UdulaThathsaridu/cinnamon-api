const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validatePayment, Payment } = require('../models/Payment');

//create payment


router.post("/", async(req,res) => {
    const { error } = validatePayment(req.body);
    const { name,number,expiryDate,cvv,issuingBank} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newPayment = new Payment(req.body);
            const result = await newPayment.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all payments

router.get("/", async(req,res) => {
    try {
        const payments = await Payment.find();
        return res.status(200).json({payments});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single payment by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const payment = await Payment.findById(id);

        if(!payment) {
            return res.status(404).json({error:"Payment not found"});
        }
        return res.status(200).json(payment);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a payment

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validatePayment(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedPayment){
            return res.status(404).json({error:"Payment not found"});

        }
        return res.status(200).json(updatedPayment);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a payment

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deletePayment = await Payment.findByIdAndDelete(id);
        if(!deletePayment){
            return res.status(404).json({error:"Payment not found"});
        }
        return res.status(200).json({message:"Payment deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

