const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({
    userId: {
        type: ObjectID,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: "₦",
    },
    stock: {
        type: Number,    
        required: true,
        min: 0
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    ratings: [
        {
            user: {
                type: ObjectID,
                ref: 'User',
            },
            rating: {
                type: Number,
                required: true,        
                min: 1,        
                max: 5,
            },
            review: {        
                type: String,
            },
        },
    ],
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;