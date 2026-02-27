const db = require('../config/db');

const Order = {
    generateOrderNumber: async () => {
        const year = new Date().getFullYear();
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM orders WHERE YEAR(created_at) = ?', [year]);
        const count = rows[0].count + 1;
        return `ORD-${year}-${String(count).padStart(5, '0')}`;
    },

    create: async (userId, totalPrice, items, deliveryData = {}) => {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const orderNumber = await Order.generateOrderNumber();
            const { delivery_type, delivery_location, customer_name, customer_phone, customer_email } = deliveryData;

            const [orderResult] = await connection.execute(
                `INSERT INTO orders (
          user_id, total_price, status, order_number, 
          delivery_type, delivery_location, customer_name, 
          customer_phone, customer_email
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId, totalPrice, 'Pending', orderNumber,
                    delivery_type || 'Pickup', delivery_location || null,
                    customer_name || null, customer_phone || null, customer_email || null
                ]
            );
            const orderId = orderResult.insertId;

            for (const item of items) {
                await connection.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price, selected_attributes) VALUES (?, ?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price, JSON.stringify(item.selected_attributes || {})]
                );

                // Update stock
                await connection.execute(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }

            await connection.commit();
            return { orderId, orderNumber };
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
        return rows[0];
    },

    findByUserId: async (userId) => {
        const [rows] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    },

    findAll: async () => {
        const [rows] = await db.execute(
            `SELECT o.*, u.name as user_name 
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
