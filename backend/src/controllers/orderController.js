const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');

// Cart Controllers
const addToCart = async (req, res, next) => {
    try {
        const { product_id, quantity } = req.body;
        await Cart.addItem(req.user.id, product_id, quantity);
        res.status(201).json({ message: 'Item added to cart' });
    } catch (err) {
        next(err);
    }
};

const getCart = async (req, res, next) => {
    try {
        const items = await Cart.getItems(req.user.id);
        res.json(items);
    } catch (err) {
        next(err);
    }
};

const updateCartQuantity = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        await Cart.updateQuantity(req.params.id, quantity);
        res.json({ message: 'Cart updated' });
    } catch (err) {
        next(err);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        await Cart.removeItem(req.params.id);
        res.json({ message: 'Item removed' });
    } catch (err) {
        next(err);
    }
};

// Order Controllers
const placeOrder = async (req, res, next) => {
    try {
        const { items, total_price } = req.body;
        const orderId = await Order.create(req.user.id, total_price, items);
        await Cart.clearCart(req.user.id);
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (err) {
        next(err);
    }
};

const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.findByUserId(req.user.id);
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        await Order.updateStatus(req.params.id, status);
        res.json({ message: 'Order status updated' });
    } catch (err) {
        next(err);
    }
};

const getOrderDetails = async (req, res, next) => {
    try {
        const items = await Order.getOrderItems(req.params.id);
        res.json(items);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addToCart, getCart, updateCartQuantity, removeFromCart,
    placeOrder, getUserOrders, getAllOrders, updateOrderStatus, getOrderDetails
};
