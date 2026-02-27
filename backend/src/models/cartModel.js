const db = require('../config/db');

const Cart = {
    addItem: async (userId, productId, quantity) => {
        // Check if item already in cart
        const [existing] = await db.execute(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existing.length > 0) {
            const newQuantity = existing[0].quantity + quantity;
            return await db.execute(
                'UPDATE cart SET quantity = ? WHERE id = ?',
                [newQuantity, existing[0].id]
            );
        }

        return await db.execute(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [userId, productId, quantity]
        );
    },

    getItems: async (userId) => {
        const [rows] = await db.execute(
            `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
            [userId]
        );
        return rows;
    },

    updateQuantity: async (id, quantity) => {
        return await db.execute('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id]);
    },

    removeItem: async (id) => {
        return await db.execute('DELETE FROM cart WHERE id = ?', [id]);
    },

    clearCart: async (userId) => {
        return await db.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
    }
};

module.exports = Cart;
