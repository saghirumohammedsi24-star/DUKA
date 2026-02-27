const Settings = require('../models/settingsModel');

const getSettings = async (req, res, next) => {
    try {
        const settings = await Settings.getAll();
        res.json(settings);
    } catch (err) {
        next(err);
    }
};

const updateSettings = async (req, res, next) => {
    try {
        const updates = req.body; // Expecting { key: value, ... }
        if (!updates) return res.status(400).json({ message: 'No settings provided' });

        for (const [key, value] of Object.entries(updates)) {
            await Settings.update(key, value);
        }

        res.json({ message: 'Settings updated successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = { getSettings, updateSettings };
