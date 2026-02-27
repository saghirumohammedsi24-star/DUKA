const express = require('express');
const {
    addToCart, getCart, updateCartQuantity, removeFromCart,
    placeOrder, getUserOrders, getAllOrders, updateOrderStatus, getOrderDetails
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Cart routes
router.get('/cart', authenticate, getCart);
router.post('/cart', authenticate, addToCart);
router.put('/cart/:id', authenticate, updateCartQuantity);
router.delete('/cart/:id', authenticate, removeFromCart);

// Order routes
router.post('/orders', authenticate, placeOrder);
router.get('/orders/user', authenticate, getUserOrders);
router.get('/orders', authenticate, authorize(['admin']), getAllOrders);
router.get('/orders/:id', authenticate, getOrderDetails);
router.put('/orders/:id/status', authenticate, authorize(['admin']), updateOrderStatus);

module.exports = router;
