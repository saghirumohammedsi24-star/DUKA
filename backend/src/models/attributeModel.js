const db = require('../config/db');

const Attribute = {
    create: async (name) => {
        const [result] = await db.execute('INSERT INTO attributes (name) VALUES (?)', [name]);
        return result;
    },

    findAll: async () => {
        const [attributes] = await db.execute('SELECT * FROM attributes');
        for (let attr of attributes) {
            const [options] = await db.execute('SELECT * FROM attribute_options WHERE attribute_id = ?', [attr.id]);
            attr.options = options;
        }
        return attributes;
    },

    addOption: async (attributeId, value, mediaUrl = null, mediaType = 'text') => {
        const [result] = await db.execute(
            'INSERT INTO attribute_options (attribute_id, value, media_url, media_type) VALUES (?, ?, ?, ?)',
            [attributeId, value, mediaUrl, mediaType]
        );
        return result;
    },

    delete: async (id) => {
        return await db.execute('DELETE FROM attributes WHERE id = ?', [id]);
    },

    deleteOption: async (optionId) => {
        return await db.execute('DELETE FROM attribute_options WHERE id = ?', [optionId]);
    }
};

module.exports = Attribute;
