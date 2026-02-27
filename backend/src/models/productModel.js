const db = require('../config/db');

const Product = {
    create: async (productData) => {
        const { name, description, price, category, stock, image_url } = productData;
        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name || null, description || null, price || null, category || null, stock || 0, image_url || null]
        );
        return result;
    },

    findAll: async (filters = {}) => {
        let sql = 'SELECT * FROM products';
        const params = [];

        if (filters.category) {
            sql += ' WHERE category = ?';
            params.push(filters.category);
        }

        if (filters.search) {
            sql += (params.length > 0 ? ' AND' : ' WHERE') + ' name LIKE ?';
            params.push(`%${filters.search}%`);
        }

        const [rows] = await db.execute(sql, params);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, productData) => {
        const { name, description, price, category, stock, image_url } = productData;
        const [result] = await db.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, image_url = ? WHERE id = ?',
            [name || null, description || null, price || null, category || null, stock || 0, image_url || null, id]
        );
        return result;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Product;
