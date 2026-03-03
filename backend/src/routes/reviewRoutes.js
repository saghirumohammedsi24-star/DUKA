const express = require('express');
const router = express.Router();
const { getProductReviews, addReview } = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

router.get('/:id', getProductReviews);
router.post('/:id', authenticate, addReview);

module.exports = router;
