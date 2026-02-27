import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Search, X, Star, Heart, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (query = '') => {
        setLoading(true);
        try {
            const res = await api.get(`/products?search=${query}`);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(search);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
    };

    return (
        <div className="container" style={{ position: 'relative' }}>
            <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <h1>All Products</h1>
                <form onSubmit={handleSearch} className="flex" style={{ width: '100%', maxWidth: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="input"
                        style={{ marginBottom: 0 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        <Search size={20} />
                    </button>
                </form>
            </div>

            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {products.map(product => (
                        <div key={product.id} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                    {products.length === 0 && <p>No products found.</p>}
                </div>
            )}

            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="product-modal-overlay"
                        onClick={() => setSelectedProduct(null)}
                    >
                        <motion.div
                            layoutId={`product-${selectedProduct.id}`}
                            className="product-modal-container"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, x: 0 }}
                            animate={{ scale: 1, x: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <button className="close-button" onClick={() => setSelectedProduct(null)}>
                                <X size={24} />
                            </button>

                            <div className="product-modal-content">
                                {/* Left Side: Image Gallery */}
                                <div className="product-modal-left">
                                    <div className="main-image-container">
                                        <img
                                            src={selectedProduct.image_url?.startsWith('http') ? selectedProduct.image_url : `${BASE_URL}${selectedProduct.image_url}`}
                                            alt={selectedProduct.name}
                                            className="zoom-image"
                                        />
                                    </div>
                                    <div className="image-thumbnails">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="thumbnail-item">
                                                <img src={selectedProduct.image_url?.startsWith('http') ? selectedProduct.image_url : `${BASE_URL}${selectedProduct.image_url}`} alt="thumb" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Side: Details */}
                                <div className="product-modal-right">
                                    <div className="details-header">
                                        <span className="category-tag">{selectedProduct.category}</span>
                                        <div className="rating-badge">
                                            <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                            <span>4.8 (120 reviews)</span>
                                        </div>
                                    </div>

                                    <h2 className="product-title-large">{selectedProduct.name}</h2>
                                    <p className="product-price-large">TZS {selectedProduct.price}</p>

                                    <div className="stock-status">
                                        <div className="pulse-dot"></div>
                                        <span>{selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock} units)` : 'Out of Stock'}</span>
                                    </div>

                                    <div className="description-scroll">
                                        <p>{selectedProduct.description}</p>
                                    </div>

                                    <div className="action-row">
                                        <div className="quantity-ctrl">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={18} /></button>
                                            <input type="number" value={quantity} readOnly />
                                            <button onClick={() => setQuantity(quantity + 1)}><Plus size={18} /></button>
                                        </div>
                                        <button className="wishlist-btn"><Heart size={20} /></button>
                                    </div>

                                    <div className="button-group-vertical">
                                        <button className="btn btn-primary buy-btn">Add to Cart</button>
                                        <button className="btn btn-secondary buy-now">Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .product-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 2rem;
                    backdrop-filter: blur(4px);
                }
                .product-modal-container {
                    background: white;
                    width: 100%;
                    max-width: 1100px;
                    border-radius: 20px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                }
                .close-button {
                    position: absolute;
                    top: 20px; right: 20px;
                    background: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px; height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                }
                .close-button:hover { transform: scale(1.1); }
                
                .product-modal-content {
                    display: flex;
                    height: 80vh;
                    max-height: 700px;
                }
                .product-modal-left {
                    flex: 1.5;
                    background: #f8fafc;
                    display: flex;
                    flex-direction: column;
                    padding: 2rem;
                    gap: 1.5rem;
                }
                .main-image-container {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    background: white;
                    border-radius: 16px;
                }
                .zoom-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    transition: transform 0.3s ease;
                }
                .zoom-image:hover {
                    transform: scale(1.1);
                    cursor: zoom-in;
                }
                .image-thumbnails {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                .thumbnail-item {
                    width: 70px; height: 70px;
                    border-radius: 10px;
                    overflow: hidden;
                    border: 2px solid transparent;
                    cursor: pointer;
                    background: white;
                }
                .thumbnail-item:hover { border-color: var(--primary); }
                .thumbnail-item img { width: 100%; height: 100%; object-fit: cover; }

                .product-modal-right {
                    flex: 1;
                    padding: 3rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    overflow-y: auto;
                }
                .category-tag {
                    background: #eff6ff;
                    color: #2563eb;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }
                .details-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .rating-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.875rem;
                    color: #64748b;
                }
                .product-title-large { font-size: 2.25rem; font-weight: 800; color: #1e293b; margin: 0; }
                .product-price-large { font-size: 1.75rem; font-weight: 700; color: #10b981; }
                
                .stock-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #16a34a;
                }
                .pulse-dot {
                    width: 8px; height: 8px;
                    background: #16a34a;
                    border-radius: 50%;
                    box-shadow: 0 0 0 rgba(22, 163, 74, 0.4);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
                }

                .description-scroll {
                    color: #64748b;
                    line-height: 1.6;
                    max-height: 150px;
                    overflow-y: auto;
                }
                
                .action-row {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-top: 1rem;
                }
                .quantity-ctrl {
                    display: flex;
                    align-items: center;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .quantity-ctrl button {
                    padding: 10px 15px;
                    background: #f8fafc;
                    border: none;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .quantity-ctrl button:hover { background: #f1f5f9; }
                .quantity-ctrl input {
                    width: 50px;
                    text-align: center;
                    border: none;
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                .wishlist-btn {
                    width: 50px; height: 50px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .wishlist-btn:hover { color: #ef4444; border-color: #fecaca; background: #fff1f2; }

                .button-group-vertical {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-top: auto;
                }
                .buy-btn { padding: 1.25rem !important; font-size: 1.1rem !important; border-radius: 14px !important; }
                .buy-now { 
                    padding: 1.25rem !important; 
                    font-size: 1.1rem !important; 
                    border-radius: 14px !important;
                    background: #f1f5f9 !important;
                    color: #1e293b !important;
                    border: none !important;
                }

                @media (max-width: 768px) {
                    .product-modal-content {
                        flex-direction: column;
                        height: auto;
                        max-height: 90vh;
                    }
                    .product-modal-left { flex: none; height: 300px; }
                    .product-modal-right { padding: 2rem; }
                    .product-title-large { font-size: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default Products;
