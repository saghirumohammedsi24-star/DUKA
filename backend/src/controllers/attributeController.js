const Attribute = require('../models/attributeModel');

const getAttributes = async (req, res, next) => {
    try {
        const attributes = await Attribute.findAll();
        res.json(attributes);
    } catch (err) {
        next(err);
    }
};

const createAttribute = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Attribute name is required' });
        const result = await Attribute.create(name);
        res.status(201).json({ message: 'Attribute created', id: result.insertId });
    } catch (err) {
        next(err);
    }
};

const addOption = async (req, res, next) => {
    try {
        const { attributeId } = req.params;
        const { value, mediaType } = req.body;
        const media_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!value) return res.status(400).json({ message: 'Option value is required' });

        const result = await Attribute.addOption(attributeId, value, media_url, mediaType || 'text');
        res.status(201).json({ message: 'Option added', id: result.insertId });
    } catch (err) {
        next(err);
    }
};

const deleteAttribute = async (req, res, next) => {
    try {
        await Attribute.delete(req.params.id);
        res.json({ message: 'Attribute deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAttributes, createAttribute, addOption, deleteAttribute };
