const Product = require('../models/productModel');

const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock, attributes } = req.body || {};

        // Handle images from upload.fields
        const image_url = req.files?.image ? `/uploads/${req.files.image[0].filename}` : (req.body?.image_url || null);
        const gallery_urls = req.files?.gallery ? req.files.gallery.map(f => `/uploads/${f.filename}`) : [];

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and Price are required' });
        }

        const result = await Product.create({
            name,
            description: description || null,
            price,
            category: category || null,
            stock: stock || 0,
            image_url,
            gallery_urls
        });

        const productId = result.insertId;

        // Handle attributes if provided
        if (attributes) {
            const attrArray = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
            for (const optionId of attrArray) {
                await Product.linkAttribute(productId, optionId);
            }
        }

        res.status(201).json({
            message: 'Product created successfully',
            productId,
            automaticId: result.automatic_id
        });
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
        const { name, description, price, category, stock, attributes } = req.body || {};

        const image_url = req.files?.image ? `/uploads/${req.files.image[0].filename}` : (req.body?.image_url || null);
        let gallery_urls = req.files?.gallery ? req.files.gallery.map(f => `/uploads/${f.filename}`) : null;

        // If gallery_urls is not provided in files, we might want to keep old ones or update from body
        if (!gallery_urls && req.body.gallery_urls) {
            gallery_urls = typeof req.body.gallery_urls === 'string' ? JSON.parse(req.body.gallery_urls) : req.body.gallery_urls;
        }

        const result = await Product.update(req.params.id, {
            name: name || null,
            description: description || null,
            price: price || null,
            category: category || null,
            stock: stock || 0,
            image_url,
            gallery_urls: gallery_urls || []
        });

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });

        // Handle attributes update
        if (attributes) {
            await Product.unlinkAttributes(req.params.id);
            const attrArray = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
            for (const optionId of attrArray) {
                await Product.linkAttribute(req.params.id, optionId);
            }
        }

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
