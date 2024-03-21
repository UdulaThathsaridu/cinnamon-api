const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validateLeave,Leave } = require('../models/Leave');

//create leaves


router.post("/", async(req,res) => {
    const { error } = validateLeave(req.body);
    const { name,leaveType,leaveTypeDetails,createdOn,leaveTypeStatus} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newLeave = new Leave(req.body);
            const result = await newLeave.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all leaves

router.get("/", async(req,res) => {
    try {
        const leaves = await Leave.find();
        return res.status(200).json({leaves});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single leave by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const leave = await Leave.findById(id);

        if(!leave) {
            return res.status(404).json({error:"Leave not found"});
        }
        return res.status(200).json(leave);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a leave

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateLeave(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedLeave = await Leave.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedLeave){
            return res.status(404).json({error:"Leave not found"});

        }
        return res.status(200).json(updatedLeave);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a leave

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteLeave = await Leave.findByIdAndDelete(id);
        if(!deleteLeave){
            return res.status(404).json({error:"Leave not found"});
        }
        return res.status(200).json({message:"Leave deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

