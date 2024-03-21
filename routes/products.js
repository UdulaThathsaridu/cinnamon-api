const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validateProduct, Product } = require('../models/Product');


//create product


router.post("/", async(req,res) => {
    const { error } = validateProduct(req.body);
    const { name,productId,quantity,price,description} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newProduct = new Product(req.body);
            const result = await newProduct.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all products

router.get("/", async(req,res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({products});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single product by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const product = await Product.findById(id);

        if(!product) {
            return res.status(404).json({error:"Payment not found"});
        }
        return res.status(200).json(product);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a product

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateProduct(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedProduct){
            return res.status(404).json({error:"Product not found"});

        }
        return res.status(200).json(updatedProduct);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a product

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        if(!deleteProduct){
            return res.status(404).json({error:"Product not found"});
        }
        return res.status(200).json({message:"Product deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

