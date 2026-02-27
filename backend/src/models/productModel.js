const db = require('../config/db');

const Product = {
    generateId: async (category) => {
        const prefix = category ? category.substring(0, 3).toUpperCase() : 'PRD';
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM products WHERE category = ?', [category]);
        const count = rows[0].count + 1;
        return `${prefix}-${String(count).padStart(5, '0')}`;
    },

    create: async (productData) => {
        const { name, description, price, category, stock, image_url, gallery_urls } = productData;
        const automatic_id = await Product.generateId(category);

        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, category, stock, image_url, automatic_id, gallery_urls) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name || null, description || null, price || null, category || null, stock || 0, image_url || null, automatic_id, JSON.stringify(gallery_urls || [])]
        );
        return { ...result, automatic_id };
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

        // Parse gallery_urls for each product
        return rows.map(row => ({
            ...row,
            gallery_urls: typeof row.gallery_urls === 'string' ? JSON.parse(row.gallery_urls) : (row.gallery_urls || [])
        }));
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        if (!rows[0]) return null;

        const product = rows[0];
        product.gallery_urls = typeof product.gallery_urls === 'string' ? JSON.parse(product.gallery_urls) : (product.gallery_urls || []);

        // Fetch attributes
        const [attributes] = await db.execute(`
            SELECT a.name as attribute_name, ao.value, ao.media_url, ao.media_type, ao.id as option_id
            FROM product_attributes pa
            JOIN attribute_options ao ON pa.attribute_option_id = ao.id
            JOIN attributes a ON ao.attribute_id = a.id
            WHERE pa.product_id = ?
        `, [id]);

        product.attributes = attributes;
        return product;
    },

    update: async (id, productData) => {
        const { name, description, price, category, stock, image_url, gallery_urls } = productData;
        const [result] = await db.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, image_url = ?, gallery_urls = ? WHERE id = ?',
            [name || null, description || null, price || null, category || null, stock || 0, image_url || null, JSON.stringify(gallery_urls || []), id]
        );
        return result;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
        return result;
    },

    // Attribute management
    linkAttribute: async (productId, attributeOptionId) => {
        return await db.execute(
            'INSERT IGNORE INTO product_attributes (product_id, attribute_option_id) VALUES (?, ?)',
            [productId, attributeOptionId]
        );
    },

    unlinkAttributes: async (productId) => {
        return await db.execute('DELETE FROM product_attributes WHERE product_id = ?', [productId]);
    }
};

module.exports = Product;
