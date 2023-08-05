const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Flutterwave = require('flutterwave-node-v3');
const { checkAuthorization } = require('../middleware/auth');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

router.get('/', checkAuthorization, async (req, res) => {
    try {
        const order = await Order.find({ userId: req.user._id }).sort({ date: -1 });
        res.status(200).json(order)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.post('/checkout', checkAuthorization, async(req,res) => {

    try {
        const userId = req.user._id;
        let payload = req.body
    

    //find cart and user 
        let cart = await Cart.findOne({ userId })
        let user = req.user
        if(cart) {
            payload = {...payload, amount: cart.bill, email: user.email}
                const response = await flw.Charge.card(payload)
                console.log(response)
                if(response.meta.authorization.mode === 'pin') {
                    let payload2 = payload
                    payload2.authorization = {
                        "mode": "pin",
                        "fields": [
                            "pin"
                        ],
                        "pin": 3310
                    }
                }
        const reCallCharge = await flw.Charge.card(payload2)

        const callValidate = await flw.Charge.validate({
            "otp": "12345",
            "flw_ref": reCallCharge.data.flw_ref
        })
        console.log(callValidate)
        if(callValidate.status === 'success') {
            const order = await Order.create({
                owner,
                items: cart.items,
                bill: cart.bill
            })
            //delete cart
            const data = await Cart.findByIdAndDelete({_id: cart.id})
            return res.status(201).send({status: 'Payment successful', order})
        } else {
            res.status(400).send('payment failed')
        }
    }
    if( response.meta.authorization.mode === 'redirect') {

        let url = response.meta.authorization.redirect
        open(url)
           // console.log(response)

        } else {
            res.status(400).send('No cart found')
        }
    } catch (error) {
        console.log(error)
        res.status(400).send('invalid request')
    }
})

module.exports = router;