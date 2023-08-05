const express = require('express');
const Product = require('../models/Product');
const { checkAdmin } = require('../middleware/auth');
const router = express.Router();

// add a product @post
router.post('/',checkAdmin, async (req,res) => {
    try {
        const newProduct = new Product({
            ...req.body,
            userId: req.user._id
        })
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json(error)
    }
})

//fetch a product @get
router.get('/:id', checkAdmin, async(req,res) => {
    try {
        const foundProduct = await Product.findById(req.params.id);
        if(!foundProduct) {
            res.status(404).json({
                error: "Item was not found"
            })
        }
        res.status(200).json(foundProduct);
    } catch (error) {
        res.status(400).json(error);
    }
})

//fetch all products sold by a user @get
router.get('/', checkAdmin, async(req,res) => {
    try {
        const foundProducts = await Product.find({
            userId: req.user._id
        });
        if(!foundProducts) {
            res.status(404).json({
                error: "Item was not found"
            })
        }
        res.status(200).json(foundProducts);
    } catch (error) {
        res.status(400).json(error);
    }
})

//update product @patch
router.patch('/:id', checkAdmin, async(req,res) => {
    const updatefield = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'category', 'price']

    const isValidOperation = updatefield.every((field) => allowedUpdates.includes(field));

    if(!isValidOperation) {
        return res.status(400).json({ error: 'invalid update operation!'})
    }

    try {
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({ error: "Item was not found!"})
        }
        updatefield.forEach((field) => {
            product[field] = req.body[field];
        })
        const savedItem = await product.save();
        res.status(200).json(savedItem)
    } catch (error) {
        res.status(500).json(error)
    }
})

//delete an item @delete
router.delete('/:id',checkAdmin, async(req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if(!deletedProduct) {
            res.status(404).json({ error: "Item not found!"})
        }
        res.status(200).json({
            message: `Product has been deleted successfuly`,
            deletedProduct
        });
    } catch (error) {
        res.status(400).json(error);
    }
})

module.exports = router;