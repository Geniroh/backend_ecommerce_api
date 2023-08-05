const express = require('express');
const Item = require('../models/Item');
const { checkAuthorization } = require('../middleware/auth');

const router = new express.Router();

//add item @post
router.post('/', checkAuthorization, async(req,res) => {
    try{
        const newItem = new Item({
            ...req.body,
            userId: req.user._id
        })
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch(error) {
        res.status(400).json(error);
    }
})

module.exports = router