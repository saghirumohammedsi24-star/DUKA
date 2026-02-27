import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 1rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <h2 style={{ marginBottom: '0.25rem', textAlign: 'center' }}>Create Account</h2>
                <p style={{ textAlign: 'center', color: 'var(--secondary)', marginBottom: '2rem', fontSize: '14px' }}>Join the DUKA premium shopping experience</p>

                {error && <div style={{ backgroundColor: '#fff1f2', color: '#e11d48', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '14px', border: '1px solid #fda4af' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600' }}>Full Name</label>
                        <input type="text" className="input" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600' }}>Email Address</label>
                        <input type="email" className="input" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600' }}>Phone Number</label>
                        <input type="tel" className="input" placeholder="+255 xxx xxx xxx" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600' }}>Password</label>
                        <input type="password" className="input" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '16px', fontWeight: '700' }}>Create My Account</button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '14px', color: 'var(--secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Login instead</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
