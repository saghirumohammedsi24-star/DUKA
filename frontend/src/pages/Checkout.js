import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            await api.post('/orders', { items, total_price: cartTotal });
            clearCart();
            setSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            console.error(err);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h1 style={{ color: 'green', marginBottom: '1rem' }}>Order Placed Successfully!</h1>
                <p>Thank you for your purchase. You will be redirected to the home page shortly.</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Checkout</h1>
            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Payment Method</h3>
                <p style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius)' }}>
                    Cash on Delivery (Demo)
                </p>

                <h3 style={{ marginBottom: '1rem' }}>Shipping Address</h3>
                <textarea className="input" placeholder="Enter your full address..." rows="4" style={{ resize: 'none' }}></textarea>

                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                    <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Order Total:</span>
                        <span>TZS {cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading || cart.length === 0}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem' }}
                    >
                        {loading ? 'Processing...' : 'Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
