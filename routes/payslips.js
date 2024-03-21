const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { validatePayslip, PaySlip } = require("../models/Payslip");
const { USER_TYPES } = require("../constants");

//create payslip


router.post("/", async(req,res) => {
    const { error } = validatePayslip(req.body);
    const { id,name,date,allowances,deductions,
          otherAllowances,otherDeductions,
          basic,totalAllowance,totalDeduction,netSalary,paymentMethod} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newPayslip = new PaySlip(req.body);
            const result = await newPayslip.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all payslips

router.get("/", async(req,res) => {
    try {
        const payslips = await PaySlip.find();
        return res.status(200).json({payslips});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single payslip by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const payslip = await PaySlip.findById(id);

        if(!payslip) {
            return res.status(404).json({error:"PaySlip not found"});
        }
        return res.status(200).json(payslip);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a payslip

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validatePayslip(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedPayslip = await PaySlip.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedPayslip){
            return res.status(404).json({error:"Payslip not found"});

        }
        return res.status(200).json(updatedPayslip);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a paysslip

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deletePayslip = await PaySlip.findByIdAndDelete(id);
        if(!deletePayslip){
            return res.status(404).json({error:"Payslip not found"});
        }
        return res.status(200).json({message:"Payslip deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

