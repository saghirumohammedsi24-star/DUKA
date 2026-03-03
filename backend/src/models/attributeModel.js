const db = require('../config/db');

const Attribute = {
    create: async (name, type = 'Variation') => {
        const [result] = await db.execute('INSERT INTO attributes (name, type) VALUES (?, ?)', [name, type]);
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

    addOption: async (attributeId, value, mediaUrl = null, mediaType = 'text', priceModifier = 0) => {
        const [result] = await db.execute(
            'INSERT INTO attribute_options (attribute_id, value, media_url, media_type, price_modifier) VALUES (?, ?, ?, ?, ?)',
            [attributeId, value, mediaUrl, mediaType, priceModifier]
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
