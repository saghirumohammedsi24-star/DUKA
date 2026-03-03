const Review = require('../models/reviewModel');

const getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findByProductId(req.params.id);
        const stats = await Review.getAverageRating(req.params.id);
        res.json({ reviews, stats });
    } catch (err) {
        next(err);
    }
};

const addReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;
        const userId = req.user.id;
        await Review.create(productId, userId, rating, comment);
        res.status(201).json({ message: 'Review added' });
    } catch (err) {
        next(err);
    }
};

module.exports = { getProductReviews, addReview };
