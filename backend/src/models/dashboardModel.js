const db = require('../config/db');

const Dashboard = {
    getSummary: async () => {
        const [sales] = await db.execute('SELECT SUM(total_price) as total_sales FROM orders WHERE status = "Completed"');
        const [orders] = await db.execute('SELECT COUNT(*) as total_orders FROM orders');
        const [products] = await db.execute('SELECT COUNT(*) as total_products FROM products');
        const [customers] = await db.execute('SELECT COUNT(*) as total_customers FROM users WHERE role = "customer"');

        // Revenue over the last 7 days
        const [revenueHistory] = await db.execute(`
            SELECT DATE(created_at) as date, SUM(total_price) as amount 
            FROM orders 
            WHERE status = "Completed" 
            AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC
        `);

        // Top Selling Products
        const [topProducts] = await db.execute(`
            SELECT p.name, COUNT(oi.id) as orders_count, SUM(oi.quantity) as total_units
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY p.id
            ORDER BY total_units DESC
            LIMIT 5
        `);

        return {
            totalSales: sales[0].total_sales || 0,
            totalOrders: orders[0].total_orders || 0,
            totalProducts: products[0].total_products || 0,
            totalCustomers: customers[0].total_customers || 0,
            revenueHistory,
            topProducts
        };
    }
};

module.exports = Dashboard;
