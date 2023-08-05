// ... your other code ...
const updatedArray = originalArray.map((item) => {
    if (item.id === targetId) {
      // Perform updates on the target object
      return { ...item, prop1: 'new value', prop2: 'updated value' };
    } else {
      // No updates, return the original object
      return item;
    }
  });
  

// ... your other code ...
// update cart @patch
router.patch("/:cartId/items/:itemId", checkAuthorization, async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const itemId = req.params.itemId;
        const updates = req.body;
    
        // Find the cart by cartId and userId to ensure the cart belongs to the authenticated user
        const cart = await Cart.findOne({ _id: cartId, userId: req.user._id });
    
        if (!cart) {
          return res.status(404).json({ error: 'Cart not found' });
        }
    
        // Find the item to update based on the itemId
        const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
    
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found in the cart' });
        }
    
        const updatefield = Object.keys(updates);
        const allowedUpdates = ['items']
    
        const isValidOperation = updatefield.every((field) => allowedUpdates.includes(field));
    
        // Only allow updates for items field
        if(!isValidOperation) {
            return res.status(400).json({ error: 'invalid update operation!'})
        }
        
        Cart.findOneAndUpdate({_id: cartId, userId: req.user._id}, )
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.patch('/:cartId/items/:itemId', checkAuthorization, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const itemId = req.params.itemId;
    const updates = req.body;

    // Find the cart by cartId and userId to ensure the cart belongs to the authenticated user
    const cart = await Cart.findOne({ _id: cartId, userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the item to update based on the itemId
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in the cart' });
    }

    const updatefield = Object.keys(updates);
    const allowedUpdates = ['items']

    const isValidOperation = updatefield.every((field) => allowedUpdates.includes(field));

    // Only allow updates for items field
    if(!isValidOperation) {
        return res.status(400).json({ error: 'invalid update operation!'})
    }

    // Apply updates to the item
    const itemToUpdate = cart.items[itemIndex];

    cart.map()
    const updatedItem = { ...updates, ...itemToUpdate };

    cart.items[itemIndex] = updatedItem;

    // Recalculate the bill based on the updated items
    cart.bill = calculateCartBill(cart.items);
    cart.updateOne(itemToUpdate,{ _id: cartId })

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);





    // // Apply updates to the item
    // Object.keys(updates).forEach((field) => {
    //   itemToUpdate[field] = updates[field];
    // });
    // // res.status(200).json(updates['items']);


    // // Recalculate the bill based on the updated items
    // cart.bill = calculateCartBill(cart.items);

    // // Save the updated cart
    // await cart.save();

    // res.status(200).json(cart);
  } catch (error) {
    res.status(400).json(error);
  }
});

function addToCart(cart, product) {
  const updatedCart = { ...cart }; // Create a shallow copy of the original cart
  const existingItemIndex = cart.items.findIndex((item) => item.productId === product.productId);

  if (existingItemIndex !== -1) {
    // If the product already exists in the cart, increase its quantity
    updatedCart.items[existingItemIndex].quantity += product.quantity;
    updatedCart.bill += product.price * product.quantity; // Update the cart's bill
  } else {
    // If the product is not already in the cart, add it as a new item
    updatedCart.items.push(product);
    updatedCart.bill += product.price * product.quantity; // Update the cart's bill
  }

  return updatedCart;
}

  
