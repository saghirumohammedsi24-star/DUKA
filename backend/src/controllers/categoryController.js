const Category = require('../models/categoryModel');

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        await Category.create(name, description);
        res.status(201).json({ message: 'Category created' });
    } catch (err) {
        next(err);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        await Category.update(req.params.id, name, description);
        res.json({ message: 'Category updated' });
    } catch (err) {
        next(err);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        await Category.delete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
