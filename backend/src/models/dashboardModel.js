const db = require('../config/db');

const Dashboard = {
    getSummary: async () => {
        const [sales] = await db.execute('SELECT SUM(total_price) as total_sales FROM orders WHERE status = "Completed"');
        const [orders] = await db.execute('SELECT COUNT(*) as total_orders FROM orders');
        const [products] = await db.execute('SELECT COUNT(*) as total_products FROM products');

        return {
            totalSales: sales[0].total_sales || 0,
            totalOrders: orders[0].total_orders || 0,
            totalProducts: products[0].total_products || 0
        };
    }
};

module.exports = Dashboard;
