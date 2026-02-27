const db = require('../config/db');

const Order = {
    create: async (userId, totalPrice, items) => {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
                [userId, totalPrice, 'Pending']
            );
            const orderId = orderResult.insertId;

            for (const item of items) {
                await connection.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price]
                );

                // Update stock
                await connection.execute(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }

            await connection.commit();
            return orderId;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    },

    findByUserId: async (userId) => {
        const [rows] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    },

    findAll: async () => {
        const [rows] = await db.execute(
            `SELECT o.*, u.name as customer_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
        );
        return rows;
    },

    updateStatus: async (id, status) => {
        return await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    },

    getOrderItems: async (orderId) => {
        const [rows] = await db.execute(
            `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
            [orderId]
        );
        return rows;
    }
};

module.exports = Order;
