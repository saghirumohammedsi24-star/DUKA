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
                            <div key={item.id} className="card flex" style={{ justifyContent: 'space-between' }}>
                                <div className="flex">
                                    <img
                                        src={imageUrl}
                                        alt={item.name}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius)' }}
                                    />
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>{item.name}</h4>
                                        <p style={{ fontWeight: 'bold' }}>TZS {item.price}</p>
                                    </div>
                                </div>

                                <div className="flex" style={{ gap: '2rem' }}>
                                    <div className="flex" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.25rem' }}>
                                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} style={{ padding: '0.25rem 0.5rem' }}>-</button>
                                        <span style={{ padding: '0 1rem' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.25rem 0.5rem' }}>+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'red' }}>
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
