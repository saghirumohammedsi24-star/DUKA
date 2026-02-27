const db = require('../config/db');

const Settings = {
    getAll: async () => {
        const [rows] = await db.execute('SELECT * FROM settings');
        return rows;
    },

    update: async (key, value) => {
        const [result] = await db.execute(
            'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
            [key, value, value]
        );
        return result;
    },

    getByCategory: async (category) => {
        const [rows] = await db.execute('SELECT * FROM settings WHERE category = ?', [category]);
        return rows;
    }
};

module.exports = Settings;
