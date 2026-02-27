import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Login to DUKA</h2>
                {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Password</label>
                    <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '14px' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
