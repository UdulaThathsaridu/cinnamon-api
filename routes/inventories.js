const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { validateInventory, Inventory } = require("../models/Inventory");
const { USER_TYPES } = require("../constants");


//create inventory
router.post("/", async (req, res) => {
    const { error } = validateInventory(req.body);
    const {  productname, sku, quantity, unitprice, itemno, suppliername } = req.body;
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    try {
        const doesInventoryAlreadyExist = await Inventory.findOne({ sku });

        if (doesInventoryAlreadyExist) {
            return res.status(400).json({ error: `A Inventory with that sku [${sku}] already exists` })
        }
        
        const newInventory = new Inventory({ productname, sku, quantity,unitprice,itemno,suppliername, createdAt: Date.now() });
        //save the Inventory
        const result = await newInventory.save();

        delete result._doc.password;

        return res.status(201).json({ ...result._doc });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

//fetch inventory
router.get("/", async (req, res) => {
    try {
        // Fetch all inventory items from the database
        const inventories = await Inventory.find();
        
        // Send the inventory data as JSON response
        return res.status(200).json({ inventories });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error:err.message});
    }
});

//update inventory
router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateInventory(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedInventory = await Inventory.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedInventory){
            return res.status(404).json({error:"Inventory not found"});

        }
        return res.status(200).json(updatedInventory);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});




//delete employee


router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteInventory = await Inventory.findByIdAndDelete(id);
        if(!deleteInventory){
            return res.status(404).json({error:"Inventory not found"});
        }
        return res.status(200).json({message:"Inventory deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
});


//get a single inventory

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const inventory = await Inventory.findById(id);

        if(!inventory) {
            return res.status(404).json({error:"Inventory not found"});
        }
        return res.status(200).json(inventory);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})





module.exports = router;