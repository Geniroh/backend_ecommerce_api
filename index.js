const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');
const itemsRoutes = require('./routes/item');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res)=> {
    res.json("Welcome to Ecommerce API")
})

app.use('/api/users', userRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.listen(PORT, ()=> {
    mongoose.connect(process.env.MONGODB_URI).then(()=> {
        console.log(`Server running on http://localhost:${PORT}`);
    }).catch((err)=> {
        console.log(err);
    })
    
})

