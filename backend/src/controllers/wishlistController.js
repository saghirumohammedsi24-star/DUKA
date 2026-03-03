const Wishlist = require('../models/wishlistModel');

const addToWishlist = async (req, res, next) => {
    try {
        const { product_id } = req.body;
        await Wishlist.add(req.user.id, product_id);
        res.status(201).json({ message: 'Item added to wishlist' });
    } catch (err) {
        next(err);
    }
};

const removeFromWishlist = async (req, res, next) => {
    try {
        const { product_id } = req.params;
        await Wishlist.remove(req.user.id, product_id);
        res.json({ message: 'Item removed from wishlist' });
    } catch (err) {
        next(err);
    }
};

const getWishlist = async (req, res, next) => {
    try {
        const items = await Wishlist.getUserWishlist(req.user.id);
        res.json(items);
    } catch (err) {
        next(err);
    }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
