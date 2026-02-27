import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User, ShoppingBag, Heart, MapPin, CreditCard, Bell,
    HelpCircle, LogOut, ChevronRight, Shield, Settings, Gift
} from 'lucide-react';
import Profile from './Profile';
import './MyAccount.css';

const MyAccount = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const menuItems = [
        { id: 'profile', label: 'My Profile', icon: User, description: 'Personal info & settings' },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag, description: 'Track & manage orders', badge: 0 },
        { id: 'wishlist', label: 'My Wishlist', icon: Heart, description: 'Saved items' },
        { id: 'addresses', label: 'My Addresses', icon: MapPin, description: 'Delivery locations' },
        { id: 'payments', label: 'Payment Methods', icon: CreditCard, description: 'Cards & mobile money' },
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alerts & updates', badge: 3 },
        { id: 'rewards', label: 'Rewards & Points', icon: Gift, description: 'Loyalty program' },
        { id: 'security', label: 'Security', icon: Shield, description: 'Password & 2FA' },
        { id: 'support', label: 'Help & Support', icon: HelpCircle, description: 'Get help' },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return <Profile />;
            case 'orders':
                return (
                    <div className="ma-placeholder-content">
                        <ShoppingBag size={56} strokeWidth={1} />
                        <h2>My Orders</h2>
                        <p>Your order history and tracking will appear here.</p>
                        <button className="ma-cta-btn" onClick={() => navigate('/')}>Start Shopping</button>
                    </div>
                );
            case 'wishlist':
                return (
                    <div className="ma-placeholder-content">
                        <Heart size={56} strokeWidth={1} />
                        <h2>My Wishlist</h2>
                        <p>Items you've saved for later will appear here.</p>
                        <button className="ma-cta-btn" onClick={() => navigate('/')}>Browse Products</button>
                    </div>
                );
            case 'addresses':
                return (
                    <div className="ma-placeholder-content">
                        <MapPin size={56} strokeWidth={1} />
                        <h2>My Addresses</h2>
                        <p>Manage your delivery addresses from your profile.</p>
                        <button className="ma-cta-btn" onClick={() => setActiveSection('profile')}>Go to Profile</button>
                    </div>
                );
            case 'payments':
                return (
                    <div className="ma-placeholder-content">
                        <CreditCard size={56} strokeWidth={1} />
                        <h2>Payment Methods</h2>
                        <p>Your saved payment methods will appear here.</p>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="ma-placeholder-content">
                        <Bell size={56} strokeWidth={1} />
                        <h2>Notifications</h2>
                        <p>No new notifications at this time.</p>
                    </div>
                );
            case 'rewards':
                return (
                    <div className="ma-placeholder-content">
                        <Gift size={56} strokeWidth={1} />
                        <h2>Rewards & Points</h2>
                        <p>Earn points with every purchase and redeem for discounts.</p>
                        <div className="ma-rewards-card">
                            <div className="ma-rewards-pts">0</div>
                            <div className="ma-rewards-label">Total Points</div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="ma-placeholder-content">
                        <Shield size={56} strokeWidth={1} />
                        <h2>Security Settings</h2>
                        <p>Manage your password and two-factor authentication.</p>
                    </div>
                );
            case 'support':
                return (
                    <div className="ma-placeholder-content">
                        <HelpCircle size={56} strokeWidth={1} />
                        <h2>Help & Support</h2>
                        <p>Need help? Contact us at <strong>support@duka.co.tz</strong></p>
                    </div>
                );
            default:
                return <Profile />;
        }
    };

    return (
        <div className="ma-layout">
            {/* Sidebar */}
            <aside className="ma-sidebar">
                {/* User Card */}
                <div className="ma-user-card">
                    <div className="ma-user-avatar">{initials}</div>
                    <div className="ma-user-info">
                        <h4>{user?.name || 'User'}</h4>
                        <p>{user?.email || ''}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="ma-nav">
                    <p className="ma-nav-label">Account</p>
                    {menuItems.slice(0, 4).map(item => (
                        <button
                            key={item.id}
                            className={`ma-nav-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            <item.icon size={18} />
                            <div className="ma-nav-text">
                                <span className="ma-nav-title">{item.label}</span>
                                <span className="ma-nav-desc">{item.description}</span>
                            </div>
                            {item.badge > 0 && <span className="ma-badge">{item.badge}</span>}
                            <ChevronRight size={14} className="ma-nav-arrow" />
                        </button>
                    ))}

                    <p className="ma-nav-label">Preferences</p>
                    {menuItems.slice(4, 7).map(item => (
                        <button
                            key={item.id}
                            className={`ma-nav-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            <item.icon size={18} />
                            <div className="ma-nav-text">
                                <span className="ma-nav-title">{item.label}</span>
                                <span className="ma-nav-desc">{item.description}</span>
                            </div>
                            {item.badge > 0 && <span className="ma-badge">{item.badge}</span>}
                            <ChevronRight size={14} className="ma-nav-arrow" />
                        </button>
                    ))}

                    <p className="ma-nav-label">Other</p>
                    {menuItems.slice(7).map(item => (
                        <button
                            key={item.id}
                            className={`ma-nav-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            <item.icon size={18} />
                            <div className="ma-nav-text">
                                <span className="ma-nav-title">{item.label}</span>
                                <span className="ma-nav-desc">{item.description}</span>
                            </div>
                            <ChevronRight size={14} className="ma-nav-arrow" />
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <button className="ma-logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="ma-main">
                {renderContent()}
            </main>
        </div>
    );
};

export default MyAccount;
