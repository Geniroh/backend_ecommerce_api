const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkAuthorization = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ 
            _id: decoded._id, 
            'tokens.token':token 
        })
        if(!user) throw new Error('User does not exist!')
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({error: "Authentication required"})
    }
}

const checkAdmin = async (req,res,next) => {
    checkAuthorization(req, res, () => {
        if (req.user.role != 'admin') {
        res.status(403).json("You are not alowed to do that!");
        } else {
            next();   
        }
    });
}

module.exports = { checkAuthorization, checkAdmin }