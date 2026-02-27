import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
            <div className="container flex" style={{ justifyContent: 'space-between' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>DUKA</Link>

                <div className="flex" style={{ gap: '1.5rem' }}>
                    <Link to="/">Products</Link>
                    {isAdmin && <Link to="/admin">Dashboard</Link>}
                    <Link to="/cart" className="flex">
                        <ShoppingCart size={20} />
                        {cart.length > 0 && <span style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0 5px', borderRadius: '10px', fontSize: '12px' }}>{cart.length}</span>}
                    </Link>

                    {user ? (
                        <div className="flex" style={{ gap: '0.75rem' }}>
                            <Link to="/account" className="flex" style={{ gap: '6px', color: 'var(--text)' }}>
                                <User size={18} />
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="flex" style={{ color: 'var(--secondary)' }}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
