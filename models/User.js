const mongoose = require('mongoose');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        match: [
            /^(?=.*[A-Z])(?=.*\d).{7,}$/i,
            'Password must contain at least one uppercase letter, one digit, and be at least 7 characters long.',
        ]
    },
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: true,
        min: 9
    },
    role: {
        type: String,
        enum: ['admin', 'vendor', 'customer'],
        default: 'customer',
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
    const user = this
        if (user.isModified('password')) {
        user.password = await argon2.hash(user.password);
    }
        next()
})

// Generate token to prevent user having to signup everytime
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ 
        _id: user._id.toString()},
        process.env.JWT_SECRET
        )
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    try {
        const user = await User.findOne({ email })
        if (!user) throw new Error
        const isMatch = await argon2.verify(user.password, password);
        if(!isMatch) throw new Error('Unable to login')
        return user;
    } catch (error) {
        return error
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;