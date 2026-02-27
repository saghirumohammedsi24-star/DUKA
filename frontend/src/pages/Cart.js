import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import { BASE_URL } from '../utils/api';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <ShoppingBag size={64} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
                <h2>Your cart is empty</h2>
                <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="btn btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem' }}>Shopping Cart ({cart.length} items)</h1>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="grid">
                    {cart.map(item => {
                        const imageUrl = item.image_url
                            ? (item.image_url.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`)
                            : 'https://via.placeholder.com/80';

                        return (
                            <div key={`${item.id}-${JSON.stringify(item.selected_attributes)}`} className="card flex" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div className="flex">
                                    <img
                                        src={imageUrl}
                                        alt={item.name}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius)' }}
                                    />
                                    <div>
                                        <h4 style={{ marginBottom: '0.1rem' }}>{item.name}</h4>
                                        {item.selected_attributes && Object.keys(item.selected_attributes).length > 0 && (
                                            <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
                                                {Object.entries(item.selected_attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                            </p>
                                        )}
                                        <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>TZS {Number(item.price).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex" style={{ gap: '1.5rem' }}>
                                    <div className="flex" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.2rem' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.selected_attributes)}
                                            style={{ padding: '0.25rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >-</button>
                                        <span style={{ padding: '0 0.8rem', fontWeight: 'bold' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selected_attributes)}
                                            style={{ padding: '0.25rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >+</button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id, item.selected_attributes)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
                    <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span>Subtotal</span>
                        <span>TZS {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total</span>
                        <span>TZS {cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem' }}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
