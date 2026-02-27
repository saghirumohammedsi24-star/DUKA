import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [deliveryType, setDeliveryType] = useState('Pickup');
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        location: ''
    });
    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        if (!form.name || !form.phone) {
            alert('Please provide your name and phone number.');
            return;
        }

        setLoading(true);
        try {
            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
                selected_attributes: item.selected_attributes || {}
            }));

            const res = await api.post('/orders', {
                items,
                total_price: cartTotal,
                delivery_data: {
                    delivery_type: deliveryType,
                    delivery_location: form.location,
                    customer_name: form.name,
                    customer_phone: form.phone,
                    customer_email: form.email
                }
            });

            setSuccessData(res.data);
            clearCart();
        } catch (err) {
            console.error(err);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (successData) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0', maxWidth: '600px' }}>
                <div style={{ backgroundColor: '#f0fdf4', padding: '3rem', borderRadius: '2rem', border: '1px solid #bbf7d0' }}>
                    <h1 style={{ color: '#15803d', marginBottom: '1rem' }}>🎉 Order Placed Successfully!</h1>
                    <p style={{ fontSize: '1.2rem', color: '#166534', marginBottom: '2rem' }}>
                        Your Order Number is <strong>{successData.orderNumber}</strong>
                    </p>

                    <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            To finalize your payment and track your order, please click the button below to message us on WhatsApp.
                        </p>
                        <a
                            href={successData.whatsapp_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{
                                display: 'block',
                                backgroundColor: '#25d366',
                                color: 'white',
                                padding: '1.2rem',
                                textDecoration: 'none',
                                borderRadius: '1rem',
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}
                        >
                            👉 Proceed to WhatsApp
                        </a>
                    </div>

                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', textDecoration: 'underline' }}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2.5rem', textAlign: 'center' }}>Confirm Your Order</h1>

            <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                {/* Delivery Form */}
                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Where should we send your order?</h3>

                    <div className="flex" style={{ gap: '1rem', marginBottom: '2rem' }}>
                        <button
                            className={`btn ${deliveryType === 'Pickup' ? 'btn-primary' : ''}`}
                            style={{ flex: 1, border: deliveryType !== 'Pickup' ? '1px solid var(--border)' : 'none' }}
                            onClick={() => setDeliveryType('Pickup')}
                        >
                            🏪 I will Pick up
                        </button>
                        <button
                            className={`btn ${deliveryType === 'Delivery' ? 'btn-primary' : ''}`}
                            style={{ flex: 1, border: deliveryType !== 'Delivery' ? '1px solid var(--border)' : 'none' }}
                            onClick={() => setDeliveryType('Delivery')}
                        >
                            🚚 I want Delivery
                        </button>
                    </div>

                    <div className="grid" style={{ gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Full Name</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="Enter your name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone Number</label>
                            <input
                                className="input"
                                type="tel"
                                placeholder="+255 xxx xxx xxx"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>
                        {deliveryType === 'Delivery' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Delivery Location</label>
                                <textarea
                                    className="input"
                                    placeholder="House number, Street, Area..."
                                    rows="3"
                                    value={form.location}
                                    onChange={e => setForm({ ...form, location: e.target.value })}
                                ></textarea>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                        {cart.map((item, i) => (
                            <div key={i} className="flex" style={{ justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
                                <span>{item.name} x {item.quantity}</span>
                                <span>TZS {Number(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total Payable:</span>
                            <span style={{ color: 'var(--primary)' }}>TZS {Number(cartTotal).toLocaleString()}</span>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading || cart.length === 0}
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                borderRadius: '1rem',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                boxShadow: '0 10px 15px rgba(99, 102, 241, 0.2)'
                            }}
                        >
                            {loading ? 'Processing...' : 'Send Order Now 🚀'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--secondary)', marginTop: '1rem' }}>
                            By confirming, you agree to our terms.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
