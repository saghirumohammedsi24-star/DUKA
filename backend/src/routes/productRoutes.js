const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize(['admin']), (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ message: err });
        }
        next();
    });
}, createProduct);

router.put('/:id', authenticate, authorize(['admin']), (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ message: err });
        }
        next();
    });
}, updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), deleteProduct);

module.exports = router;
