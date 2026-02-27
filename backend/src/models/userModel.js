const db = require('../config/db');

const User = {
    create: async (name, email, password, role = 'customer') => {
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result;
    },

    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    findById: async (id) => {
        if (!id) {
            console.error('User.findById: id is undefined or null');
            return null;
        }
        const [rows] = await db.execute('SELECT id, name, email, role, display_name, profile_photo, wallet_balance, loyalty_points, status FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    getFullProfile: async (id) => {
        if (!id) {
            console.error('User.getFullProfile: id is undefined or null');
            return null;
        }
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        const user = rows[0];
        if (user) {
            delete user.password;
            
            // If admin, include some global stats
            if (user.role === 'admin') {
                const [[{ total_users }]] = await db.execute('SELECT COUNT(*) as total_users FROM users');
                const [[{ total_products }]] = await db.execute('SELECT COUNT(*) as total_products FROM products');
                const [[{ total_orders }]] = await db.execute('SELECT COUNT(*) as total_orders FROM orders');
                const [[{ total_sales }]] = await db.execute('SELECT SUM(total_price) as total_sales FROM orders WHERE status = "Completed"');
                
                user.admin_stats = {
                    total_users,
                    total_products,
                    total_orders,
                    total_sales: total_sales || 0
                };
            } else {
                // For customer, include personal stats
                const [[{ total_orders }]] = await db.execute('SELECT COUNT(*) as total_orders FROM orders WHERE user_id = ?', [id]);
                user.total_orders = total_orders;
            }
        }
        return user;
    },

    updateProfile: async (id, data) => {
        const fields = [];
        const values = [];

        const allowedFields = ['name', 'display_name', 'profile_photo', 'dob', 'gender', 'phone'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        });

        if (fields.length === 0) return null;

        values.push(id);
        const [result] = await db.execute(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result;
    },

    // Address methods
    getAddresses: async (userId) => {
        const [rows] = await db.execute('SELECT * FROM addresses WHERE user_id = ?', [userId]);
        return rows;
    },

    addAddress: async (userId, data) => {
        const { full_address, city_region_zone, postal_code, country, gps_location, is_default } = data;
        const [result] = await db.execute(
            'INSERT INTO addresses (user_id, full_address, city_region_zone, postal_code, country, gps_location, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, full_address, city_region_zone, postal_code, country, gps_location, is_default || false]
        );
        return result;
    },

    deleteAddress: async (id, userId) => {
        const [result] = await db.execute('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
        return result;
    },

    setDefaultAddress: async (addressId, userId) => {
        await db.execute('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
        return await db.execute('UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?', [addressId, userId]);
    }
};

module.exports = User;
