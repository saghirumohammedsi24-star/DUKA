import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../utils/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="container">Loading product details...</div>;
    if (!product) return <div className="container">Product not found.</div>;

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : `${BASE_URL}${product.image_url}`)
        : 'https://via.placeholder.com/400';

    return (
        <div className="container">
            <button onClick={() => navigate(-1)} className="flex" style={{ marginBottom: '2rem', color: 'var(--secondary)' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
                <img
                    src={imageUrl}
                    alt={product.name}
                    style={{ width: '100%', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}
                />

                <div>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{product.category}</span>
                    <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--foreground)', marginBottom: '1.5rem' }}>
                        TZS {product.price}
                    </p>
                    <p style={{ color: 'var(--secondary)', marginBottom: '2rem', lineHeight: '1.8' }}>
                        {product.description}
                    </p>

                    <div className="flex" style={{ marginBottom: '2rem' }}>
                        <div className="flex" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.25rem' }}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '0.5rem 1rem' }}>-</button>
                            <span style={{ padding: '0.5rem 1.5rem', fontWeight: 'bold' }}>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} style={{ padding: '0.5rem 1rem' }}>+</button>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            addToCart(product, quantity);
                            navigate('/cart');
                        }}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                    >
                        <ShoppingCart size={20} style={{ marginRight: '0.5rem' }} /> Add to Cart
                    </button>

                    <p style={{ marginTop: '1rem', fontSize: '14px', color: 'var(--secondary)' }}>
                        In Stock: {product.stock} units
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
