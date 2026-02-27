const Product = require('../models/productModel');

const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock } = req.body || {};
        const image_url = req.file ? `/uploads/${req.file.filename}` : (req.body?.image_url || null);

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and Price are required' });
        }

        const result = await Product.create({
            name,
            description: description || null,
            price,
            category: category || null,
            stock: stock || 0,
            image_url
        });
        res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
    } catch (err) {
        next(err);
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        const category = req.query.category || null;
        const search = req.query.search || null;
        const products = await Product.findAll({ category, search });
        res.json(products);
    } catch (err) {
        next(err);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock } = req.body || {};
        let image_url = req.body?.image_url || null;

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        const result = await Product.update(req.params.id, {
            name: name || null,
            description: description || null,
            price: price || null,
            category: category || null,
            stock: stock || 0,
            image_url
        });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const result = await Product.delete(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
