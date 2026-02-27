import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
    User, Phone, Mail, MapPin, Calendar, ShoppingBag,
    Package, CreditCard, Star, Award, Edit3, ChevronRight,
    Shield, Clock, Heart, TrendingUp, CheckCircle, X, Save, Plus, Trash2
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Edit state
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, [user]);

    const fetchProfileData = async () => {
        try {
            const profRes = await api.get('/users/profile');
            setProfile(profRes.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
            if (user) {
                setProfile({
                    id: user.id, name: user.name, email: user.email, role: user.role,
                    loyalty_points: 0, wallet_balance: '0.00', status: 'Active'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const startEditing = () => {
        setEditForm({
            name: profile.name || '',
            display_name: profile.display_name || '',
            phone: profile.phone || '',
            dob: profile.dob ? profile.dob.split('T')[0] : '',
            gender: profile.gender || ''
        });
        setEditing(true);
        setMessage(null);
    };

    const cancelEditing = () => {
        setEditing(false);
        setMessage(null);
    };

    const saveProfile = async () => {
        setSaving(true);
        try {
            await api.put('/users/profile', editForm);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditing(false);
            // Refresh
            const res = await api.get('/users/profile');
            setProfile(res.data);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-loading">
                <User size={48} />
                <p>Please login to view your profile.</p>
            </div>
        );
    }

    const initials = profile.name
        ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="pf-page">
            {/* Hero Section */}
            <div className="pf-hero">
                <div className="pf-hero-bg">
                    <div className="pf-hero-pattern"></div>
                </div>
                <div className="container">
                    <div className="pf-hero-content">
                        <div className="pf-avatar-wrap">
                            {profile.profile_photo ? (
                                <img src={`${BASE_URL}${profile.profile_photo}`} alt="Avatar" className="pf-avatar-img" />
                            ) : (
                                <div className="pf-avatar-initials">{initials}</div>
                            )}
                            <div className="pf-avatar-status"></div>
                        </div>
                        <div className="pf-hero-info">
                            <h1 className="pf-name">{profile.display_name || profile.name}</h1>
                            <p className="pf-role">
                                <span className="pf-badge">{profile.role === 'admin' ? '⚡ Admin' : '🛍️ Customer'}</span>
                                <span className="pf-member-id">DUKA-{String(profile.id).padStart(6, '0')}</span>
                            </p>
                            <div className="pf-hero-meta">
                                <span><Mail size={14} /> {profile.email}</span>
                                {profile.phone && <span><Phone size={14} /> {profile.phone}</span>}
                                <span><Clock size={14} /> Member since {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="container">
                <div className="pf-stats-bar">
                    {profile.role === 'admin' ? (
                        <>
                            <div className="pf-stat-card">
                                <div className="pf-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                    <ShoppingBag size={22} />
                                </div>
                                <div>
                                    <span className="pf-stat-num">{profile.admin_stats?.total_orders || 0}</span>
                                    <span className="pf-stat-label">Total Orders</span>
                                </div>
                            </div>
                            <div className="pf-stat-card">
                                <div className="pf-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                    <TrendingUp size={22} />
                                </div>
                                <div>
                                    <span className="pf-stat-num">TZS {Number(profile.admin_stats?.total_sales || 0).toLocaleString()}</span>
                                    <span className="pf-stat-label">Total Sales</span>
                                </div>
                            </div>
                            <div className="pf-stat-card">
                                <div className="pf-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                    <Package size={22} />
                                </div>
                                <div>
                                    <span className="pf-stat-num">{profile.admin_stats?.total_products || 0}</span>
                                    <span className="pf-stat-label">Products</span>
                                </div>
                            </div>
                            <div className="pf-stat-card">
                                <div className="pf-stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                                    <User size={22} />
                                </div>
                                <div>
                                    <span className="pf-stat-num">{profile.admin_stats?.total_users || 0}</span>
                                    <span className="pf-stat-label">System Users</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="pf-stat-card">
                                <div className="pf-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                    <Package size={22} />
                                </div>
                                <div>
                                    <span className="pf-stat-num">{profile.total_orders || 0}</span>
                                    <span className="pf-stat-label">Orders</span>
                                </div>
                            </div>
                            <div className="pf-stat-card">
                                <div className="pf-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                    <CreditCard size={22} />
                                </div>
                                <div>
                                    <span className="pf-stat-num">TZS {profile.wallet_balance || '0'}</span>
                                    <span className="pf-stat-label">Wallet</span>
                                </div>
                            </div>
                            <div className="pf-stat-card">
                                <div className="pf-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                    <Star size={22} />
                                </div>
                                <div>
                                    <span className="pf-stat-num">{profile.loyalty_points || 0}</span>
                                    <span className="pf-stat-label">Points</span>
                                </div>
                            </div>
                            <div className="pf-stat-card">
                                <div className="pf-stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                                    <Heart size={22} />
                                </div>
                                <div>
                                    <span className="pf-stat-num">{profile.status || 'Active'}</span>
                                    <span className="pf-stat-label">Status</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Toast Message */}
            {message && (
                <div className="container">
                    <div className={`pf-toast ${message.type}`}>
                        <span>{message.text}</span>
                        <button onClick={() => setMessage(null)}><X size={16} /></button>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="container">
                <div className="pf-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`pf-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="container">
                <div className="pf-content">

                    {/* ============ OVERVIEW TAB ============ */}
                    {activeTab === 'overview' && (
                        <div className="pf-grid-2">
                            {profile.role === 'admin' ? (
                                <>
                                    <div className="pf-card">
                                        <div className="pf-card-header">
                                            <h3><Shield size={18} /> Admin Privileges</h3>
                                        </div>
                                        <div className="pf-activity-list">
                                            <div className="pf-activity-item">
                                                <div className="pf-activity-dot" style={{ background: '#10b981' }}></div>
                                                <div>
                                                    <p className="pf-activity-text">Full System Access Enabled</p>
                                                    <p className="pf-activity-time">You have administrative control over users, products, and orders.</p>
                                                </div>
                                            </div>
                                            <div className="pf-activity-item">
                                                <div className="pf-activity-dot" style={{ background: '#6366f1' }}></div>
                                                <div>
                                                    <p className="pf-activity-text">Security Monitor Active</p>
                                                    <p className="pf-activity-time">System-wide monitoring is enabled.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pf-card">
                                        <div className="pf-card-header">
                                            <h3><TrendingUp size={18} /> Quick Navigation</h3>
                                        </div>
                                        <div className="pf-admin-nav">
                                            <a href="/admin" className="pf-nav-link">
                                                <div className="pf-nav-icon"><Shield size={16} /></div>
                                                <span>Open Admin Dashboard</span>
                                                <ChevronRight size={16} />
                                            </a>
                                            <div className="pf-nav-hint">
                                                <p>Use the dashboard for advanced inventory and user management.</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="pf-card">
                                        <div className="pf-card-header">
                                            <h3><ShoppingBag size={18} /> Recent Activity</h3>
                                        </div>
                                        <div className="pf-activity-list">
                                            <div className="pf-activity-item">
                                                <div className="pf-activity-dot" style={{ background: '#10b981' }}></div>
                                                <div>
                                                    <p className="pf-activity-text">Account created successfully</p>
                                                    <p className="pf-activity-time">{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Today'}</p>
                                                </div>
                                            </div>
                                            <div className="pf-activity-item">
                                                <div className="pf-activity-dot" style={{ background: '#6366f1' }}></div>
                                                <div>
                                                    <p className="pf-activity-text">Welcome to DUKA! Start shopping</p>
                                                    <p className="pf-activity-time">Explore our products</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pf-card">
                                        <div className="pf-card-header">
                                            <h3><Award size={18} /> Loyalty Program</h3>
                                        </div>
                                        <div className="pf-loyalty">
                                            <div className="pf-loyalty-circle">
                                                <div className="pf-loyalty-ring">
                                                    <span className="pf-loyalty-pts">{profile.loyalty_points || 0}</span>
                                                    <span className="pf-loyalty-label">Points</span>
                                                </div>
                                            </div>
                                            <div className="pf-loyalty-info">
                                                <p className="pf-loyalty-tier">🥉 Bronze Member</p>
                                                <p className="pf-loyalty-next">Earn <strong>500 more</strong> points for Silver</p>
                                                <div className="pf-progress-bar">
                                                    <div className="pf-progress-fill" style={{ width: `${Math.min((profile.loyalty_points || 0) / 500 * 100, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ============ PERSONAL TAB ============ */}
                    {activeTab === 'personal' && (
                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3><User size={18} /> Personal Information</h3>
                                {!editing ? (
                                    <button className="pf-edit-btn" onClick={startEditing}><Edit3 size={14} /> Edit</button>
                                ) : (
                                    <div className="pf-header-actions">
                                        <button className="pf-save-btn" onClick={saveProfile} disabled={saving}>
                                            <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button className="pf-cancel-btn" onClick={cancelEditing}><X size={14} /> Cancel</button>
                                    </div>
                                )}
                            </div>

                            {!editing ? (
                                <div className="pf-info-grid">
                                    <div className="pf-info-row">
                                        <label>Full Name</label>
                                        <span>{profile.name}</span>
                                    </div>
                                    <div className="pf-info-row">
                                        <label>Display Name</label>
                                        <span>{profile.display_name || '—'}</span>
                                    </div>
                                    <div className="pf-info-row">
                                        <label>Email Address</label>
                                        <span className="pf-with-badge">
                                            {profile.email}
                                            {profile.email_verified
                                                ? <span className="pf-verified"><CheckCircle size={13} /> Verified</span>
                                                : <span className="pf-unverified">Unverified</span>}
                                        </span>
                                    </div>
                                    <div className="pf-info-row">
                                        <label>Phone Number</label>
                                        <span>{profile.phone || '—'}</span>
                                    </div>
                                    <div className="pf-info-row">
                                        <label>Date of Birth</label>
                                        <span>{profile.dob ? new Date(profile.dob).toLocaleDateString() : '—'}</span>
                                    </div>
                                    <div className="pf-info-row">
                                        <label>Gender</label>
                                        <span>{profile.gender || '—'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="pf-edit-form">
                                    <div className="pf-form-grid">
                                        <div className="pf-form-group">
                                            <label>Full Name</label>
                                            <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                        </div>
                                        <div className="pf-form-group">
                                            <label>Display Name</label>
                                            <input type="text" value={editForm.display_name} placeholder="Optional nickname" onChange={e => setEditForm({ ...editForm, display_name: e.target.value })} />
                                        </div>
                                        <div className="pf-form-group">
                                            <label>Phone Number</label>
                                            <input type="tel" value={editForm.phone} placeholder="+255 xxx xxx xxx" onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                        </div>
                                        <div className="pf-form-group">
                                            <label>Date of Birth</label>
                                            <input type="date" value={editForm.dob} onChange={e => setEditForm({ ...editForm, dob: e.target.value })} />
                                        </div>
                                        <div className="pf-form-group">
                                            <label>Gender</label>
                                            <select value={editForm.gender} onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                                                <option value="">Select...</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ============ SECURITY TAB ============ */}
                    {activeTab === 'security' && (
                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3><Shield size={18} /> Security & Account</h3>
                            </div>
                            <div className="pf-security-list">
                                <div className="pf-security-item">
                                    <div>
                                        <h4>Change Password</h4>
                                        <p>Update your password regularly for security.</p>
                                    </div>
                                    <button className="pf-action-btn">Update</button>
                                </div>
                                <div className="pf-security-item">
                                    <div>
                                        <h4>Two-Factor Authentication</h4>
                                        <p>Add an extra layer of protection.</p>
                                    </div>
                                    <button className="pf-action-btn">Enable</button>
                                </div>
                                <div className="pf-security-item">
                                    <div>
                                        <h4>Account Status</h4>
                                        <p>Your account is <strong style={{ color: '#10b981' }}>Active</strong></p>
                                    </div>
                                    <span className="pf-status-dot"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
