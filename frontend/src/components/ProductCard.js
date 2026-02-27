import React from 'react';
import { useCart } from '../context/CartContext';
import { BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : `${BASE_URL}${product.image_url}`)
        : 'https://via.placeholder.com/200';

    return (
        <motion.div
            layoutId={`product-${product.id}`}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <img
                src={imageUrl}
                alt={product.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '1rem' }}
            />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
            <p style={{ color: 'var(--secondary)', fontSize: '14px', flexGrow: 1, marginBottom: '1rem' }}>
                {product.description?.substring(0, 60)}...
            </p>
            <div className="flex" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>TZS {product.price}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '14px' }}
                >
                    Add to Cart
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
