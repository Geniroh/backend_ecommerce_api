const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
  userId: {
    type: ObjectID,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: ObjectID,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    type: String,
    required: true,
  },
  billingAddress: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending',
  }
},{
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
