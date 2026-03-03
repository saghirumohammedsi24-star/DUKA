import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { BASE_URL } from '../utils/api';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/wishlist');
            setWishlist(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`);
            setWishlist(prev => prev.filter(item => item.product_id !== productId));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-loading">Loading Wishlist...</div>;

    if (wishlist.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <Heart size={64} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
                <h2>Your wishlist is empty</h2>
                <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>Save items you love to find them easily later.</p>
                <Link to="/" className="btn btn-primary">Discover Products</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <h1 style={{ marginBottom: '2.5rem' }}>My Wishlist</h1>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {wishlist.map(item => (
                    <div key={item.product_id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', height: '200px' }}>
                            <img
                                src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`) : 'https://via.placeholder.com/300'}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                                onClick={() => handleRemove(item.product_id)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'white',
                                    border: 'none',
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{item.name}</h3>
                            <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1.5rem' }}>TZS {Number(item.price).toLocaleString()}</p>

                            <div className="flex" style={{ gap: '1rem' }}>
                                <button
                                    onClick={() => navigate(`/product/${item.product_id}`)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ flex: 1 }}
                                >
                                    View details
                                </button>
                                <button
                                    onClick={() => {
                                        addToCart(item, 1);
                                        navigate('/cart');
                                    }}
                                    className="btn btn-primary btn-sm"
                                    style={{ padding: '0.6rem' }}
                                >
                                    <ShoppingCart size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
