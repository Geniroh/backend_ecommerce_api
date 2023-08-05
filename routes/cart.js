const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { checkAuthorization, checkAdmin } = require('../middleware/auth');
const { calculateCartBill } = require('../utils/utils');

const router = express.Router();

// get a cart @get
router.get('/', checkAuthorization, async(req,res) => {
    try {
        const cart = await Cart.find({ userId: req.user._id });
        if(!cart) res.status(404).json("No item found in the cart");

        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json(error);
    }
})

//get all carts @get
router.get('/all', checkAdmin, async(req,res) => {
    try {
        const allCart = await Cart.find({});

        res.status(200).json(allCart);
    } catch (error) {
        res.status(400).json(error);
    }
})

// add to cart @post
router.post('/', checkAuthorization, async (req,res) => {
    const { items } = req.body;
    const userId = req.user._id;

    try {
        const productIds = items.map((item) => item.productId);
        const existingProducts = await Product.find({ _id: { $in: productIds } });

        if (existingProducts.length !== productIds.length) {
            return res.status(404).json({ error: 'Invalid product(s) in the cart' });
        }

        let existingCart = await Cart.findOne({ userId });

        if (existingCart) {
        // If a cart already exists, append the new items to the existing cart
        existingCart.items.push(...items);
        existingCart.bill = calculateCartBill(existingCart.items);
        await existingCart.save();

        res.status(200).json(existingCart);
        } else {
            const newItem = new Cart({
                ...req.body,
                userId: req.user._id,
                bill: calculateCartBill(items)
            })
            const savedItem = await newItem.save();
            res.status(201).json(savedItem);
        }

    } catch (error) {
        res.status(500).json(error);
    }
})

// DELETE a cart item @delete
router.delete('/:cartId/items/:productId', checkAuthorization, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;

    // Find the cart by cartId and userId to ensure the cart belongs to the authenticated user
    const cart = await Cart.findOne({ _id: cartId, userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the index of the item to remove based on the productId
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in the cart' });
    }

    // Remove the item from the cart's items array
    cart.items.splice(itemIndex, 1);

    // Recalculate the bill based on the updated items
    cart.bill = calculateCartBill(cart.items);

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json(error);
  }
});

//delete a cart
router.delete('/:id', checkAuthorization, async(req,res) => {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.id);
        res.status(204).json({
            message: "Cart has been successfully deleted",
            deletedCart
        })
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;