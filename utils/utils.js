const calculateCartBill = (cartItems) => {
    if(Array.isArray(cartItems)){
        let bill = 0;
        cartItems.forEach(item => {
            bill += item.quantity * item.price
        })

        return bill;
    } else {
        return "Cannot perform operation on provided value"
    }
}

module.exports = { calculateCartBill }