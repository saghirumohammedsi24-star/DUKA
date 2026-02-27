const User = require('../models/userModel');

const getProfile = async (req, res, next) => {
    try {
        const profile = await User.getFullProfile(req.user.id);
        res.json(profile);
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const result = await User.updateProfile(req.user.id, req.body);
        if (!result) return res.status(400).json({ message: 'No valid fields provided for update' });
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        next(err);
    }
};

const getAddresses = async (req, res, next) => {
    try {
        const addresses = await User.getAddresses(req.user.id);
        res.json(addresses);
    } catch (err) {
        next(err);
    }
};

const addAddress = async (req, res, next) => {
    try {
        await User.addAddress(req.user.id, req.body);
        res.status(201).json({ message: 'Address added successfully' });
    } catch (err) {
        next(err);
    }
};

const deleteAddress = async (req, res, next) => {
    try {
        await User.deleteAddress(req.params.id, req.user.id);
        res.json({ message: 'Address deleted successfully' });
    } catch (err) {
        next(err);
    }
};

const setDefaultAddress = async (req, res, next) => {
    try {
        await User.setDefaultAddress(req.params.id, req.user.id);
        res.json({ message: 'Default address updated' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAddresses,
    addAddress,
    deleteAddress,
    setDefaultAddress
};
