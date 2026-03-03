const db = require('../config/db');

const Wishlist = {
    add: async (userId, productId) => {
        return await db.execute(
            'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );
    },

    remove: async (userId, productId) => {
        return await db.execute(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
    },

    getUserWishlist: async (userId) => {
        const [rows] = await db.execute(
            `SELECT w.*, p.name, p.price, p.image_url, p.automatic_id 
             FROM wishlist w 
             JOIN products p ON w.product_id = p.id 
             WHERE w.user_id = ?`,
            [userId]
        );
        return rows;
    }
};

module.exports = Wishlist;
