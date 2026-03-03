const db = require('../config/db');

const Review = {
    findByProductId: async (productId) => {
        const [rows] = await db.execute(`
            SELECT r.*, u.name as user_name 
            FROM product_reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.product_id = ? 
            ORDER BY r.created_at DESC
        `, [productId]);
        return rows;
    },

    create: async (productId, userId, rating, comment) => {
        const [result] = await db.execute(
            'INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [productId, userId, rating, comment]
        );
        return result;
    },

    getAverageRating: async (productId) => {
        const [rows] = await db.execute(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM product_reviews WHERE product_id = ?',
            [productId]
        );
        return rows[0];
    }
};

module.exports = Review;
