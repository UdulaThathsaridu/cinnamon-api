const router = require('express').Router();
const {validateEmployee,Employee} = require("../models/Employee");

router.post("/employee",async(req,res) =>{
    const {error} = validateEmployee(req.body);
    if(error){
        return res.status(400).json({error:error.details[0].message})
    }
    try {
        const savedEmployee = await Employee.create(req.body);
        res.status(201).json(savedEmployee);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error:"Internal server error"});
    }
})


module.exports = router;