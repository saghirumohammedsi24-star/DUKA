import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from '../utils/api';
import {
    User, Phone, Mail, MapPin, Calendar, ShoppingBag,
    CreditCard, Bell, Shield, Globe, HelpCircle,
    Heart, FileText, Settings as SettingsIcon, CheckCircle, Package
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [profRes, addrRes] = await Promise.all([
                    api.get('/users/profile'),
                    api.get('/users/addresses')
                ]);
                setProfile(profRes.data);
                setAddresses(addrRes.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Loading Profile...</div>;
    if (!profile) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Please login to view profile.</div>;

    return (
        <div className="container profile-page">
            <div className="profile-header">
                <div className="profile-cover"></div>
                <div className="profile-info-main">
                    <div className="profile-avatar-container">
                        {profile.profile_photo ? (
                            <img src={`${BASE_URL}${profile.profile_photo}`} alt="Profile" className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    <div className="profile-text">
                        <h1>{profile.display_name || profile.name}</h1>
                        <p className="profile-role">Registered Customer • {profile.status || 'Active'}</p>
                    </div>
                </div>
            </div>

            <div className="profile-grid">
                {/* Left Column: Activity Summary & Contact */}
                <div className="profile-col">
                    <section className="profile-section card">
                        <h2 className="section-title"><ShoppingBag size={20} /> Order & Activity Summary</h2>
                        <div className="activity-stats">
                            <div className="stat-item">
                                <span className="stat-label">Total Orders</span>
                                <span className="stat-value">{profile.total_orders || 0}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Total Spend</span>
                                <span className="stat-value">TZS {profile.total_spend || '0.00'}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Loyalty Points</span>
                                <span className="stat-value">{profile.loyalty_points || 0}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Wallet Balance</span>
                                <span className="stat-value">TZS {profile.wallet_balance || '0.00'}</span>
                            </div>
                        </div>
                    </section>

                    <section className="profile-section card">
                        <h2 className="section-title"><Phone size={20} /> Contact Information</h2>
                        <div className="info-list">
                            <div className="info-item">
                                <Mail size={18} />
                                <div>
                                    <p className="label">Email Address</p>
                                    <p className="value">{profile.email} {profile.email_verified ? <CheckCircle size={14} className="verified" /> : <span className="unverified">Unverified</span>}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <Phone size={18} />
                                <div>
                                    <p className="label">Primary Phone</p>
                                    <p className="value">{profile.phone || 'Not set'} {profile.phone_verified ? <CheckCircle size={14} className="verified" /> : profile.phone && <span className="unverified">Unverified</span>}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Personal Info & Addresses */}
                <div className="profile-col">
                    <section className="profile-section card">
                        <h2 className="section-title"><User size={20} /> Basic Personal Information</h2>
                        <div className="info-list grid-info">
                            <div className="info-item">
                                <div>
                                    <p className="label">Full Name</p>
                                    <p className="value">{profile.name}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div>
                                    <p className="label">Username</p>
                                    <p className="value">{profile.display_name || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <Calendar size={18} />
                                <div>
                                    <p className="label">Date of Birth</p>
                                    <p className="value">{profile.dob ? new Date(profile.dob).toLocaleDateString() : 'Not set'}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div>
                                    <p className="label">Gender</p>
                                    <p className="value">{profile.gender || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="profile-section card">
                        <div className="section-header">
                            <h2 className="section-title"><MapPin size={20} /> Address Information</h2>
                        </div>
                        <div className="address-list">
                            {addresses.length === 0 ? (
                                <p className="empty-text">No addresses saved yet.</p>
                            ) : (
                                addresses.map(addr => (
                                    <div key={addr.id} className={`address-item ${addr.is_default ? 'default' : ''}`}>
                                        <div className="address-icon"><MapPin size={20} /></div>
                                        <div className="address-details">
                                            <p className="address-main">{addr.full_address}</p>
                                            <p className="address-sub">{addr.city_region_zone}, {addr.country}</p>
                                            {addr.is_default && <span className="default-badge">Default Delivery Address</span>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="profile-section card">
                        <h2 className="section-title"><FileText size={20} /> Account Information</h2>
                        <div className="info-list grid-info">
                            <div className="info-item">
                                <div>
                                    <p className="label">Customer ID</p>
                                    <p className="value">DUKA-{profile.id.toString().padStart(6, '0')}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div>
                                    <p className="label">Account Status</p>
                                    <p className="value"><span className="status-active">Active</span></p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div>
                                    <p className="label">Member Since</p>
                                    <p className="value">{new Date(profile.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
