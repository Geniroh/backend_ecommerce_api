const express = require('express');
const User = require('../models/User');
const { checkAuthorization } = require('../middleware/auth');

const router = express.Router();

//signup @post
router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({user, token})
    } catch (error) {
        res.status(400).json(error)
    }
})

//login @post
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).json({ user, token })
    } catch (error) {
        res.status(400).json(error)
    }
})


//logout @post
router.post('/logout', checkAuthorization, async (req, res) => {
    try {
        req.user.tokens =  req.user.tokens.filter((token) => {
        return token.token !== req.token
      })
        await req.user.save()
        res.json("Logged out successfully");
    } catch (error) {
        res.status(500).json(error)
    }
})

//logoutall @post
router.post('/logoutall', checkAuthorization, async (req,res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).json("User logged out successfully");
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;