import React, { useState } from 'react';
import {
    User, MapPin, CreditCard, Bell, Shield, Globe,
    HelpCircle, Heart, Lock, LogOut, Trash2, Languages,
    Smartphone, Mail, Check, ChevronRight
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('account');

    const sections = [
        { id: 'account', label: 'Account Settings', icon: User },
        { id: 'address', label: 'Address Settings', icon: MapPin },
        { id: 'payment', label: 'Payment Settings', icon: CreditCard },
        { id: 'notifications', label: 'Notification Settings', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield },
        { id: 'localization', label: 'Language & Locale', icon: Globe },
        { id: 'support', label: 'Support & Help', icon: HelpCircle },
        { id: 'preferences', label: 'Preferences', icon: Heart }
    ];

    return (
        <div className="container settings-page">
            <h1 style={{ marginBottom: '2rem' }}>Customer Settings</h1>

            <div className="settings-layout">
                {/* Sidebar Navigation */}
                <aside className="settings-sidebar">
                    {sections.map(section => (
                        <div
                            key={section.id}
                            className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            <section.icon size={20} />
                            <span>{section.label}</span>
                            <ChevronRight size={16} className="chevron" />
                        </div>
                    ))}

                    <div className="settings-nav-item logout">
                        <LogOut size={20} />
                        <span>Logout from all sessions</span>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="settings-content card">
                    {activeSection === 'account' && (
                        <div className="settings-section">
                            <h2>Account Settings</h2>
                            <p className="section-desc">Manage your profile details and account security.</p>

                            <div className="settings-group">
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Edit Profile Details</h4>
                                        <p>Change your name, username, and bio.</p>
                                    </div>
                                    <button className="btn-outline">Edit</button>
                                </div>
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Change Phone Number</h4>
                                        <p>Update your primary contact number.</p>
                                    </div>
                                    <button className="btn-outline">Update</button>
                                </div>
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Change Email Address</h4>
                                        <p>Update your login email and notifications.</p>
                                    </div>
                                    <button className="btn-outline">Update</button>
                                </div>
                            </div>

                            <div className="danger-zone" style={{ marginTop: '3rem' }}>
                                <h3>Security & Access</h3>
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Change Password</h4>
                                        <p>It's a good idea to use a strong password.</p>
                                    </div>
                                    <button className="btn-outline">Change</button>
                                </div>
                                <div className="setting-tile">
                                    <div className="tile-info" style={{ color: '#ef4444' }}>
                                        <h4>Deactivate Account</h4>
                                        <p>Temporarily disable your profile.</p>
                                    </div>
                                    <button className="btn-danger-outline">Deactivate</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'privacy' && (
                        <div className="settings-section">
                            <h2>Privacy & Security Settings</h2>
                            <p className="section-desc">Privacy is not a feature—it’s a promise.</p>

                            <div className="settings-group">
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Two-Factor Authentication (2FA)</h4>
                                        <p>Add an extra layer of security to your account.</p>
                                    </div>
                                    <div className="toggle-switch">
                                        <input type="checkbox" id="2fa" />
                                        <label htmlFor="2fa"></label>
                                    </div>
                                </div>
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Manage Active Devices</h4>
                                        <p>View and log out of devices currently logged in.</p>
                                    </div>
                                    <button className="btn-outline">View</button>
                                </div>
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Download Personal Data</h4>
                                        <p>Get a copy of your data for your records.</p>
                                    </div>
                                    <button className="btn-outline">Request</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="settings-section">
                            <h2>Notification Settings</h2>
                            <p className="section-desc">Choose how you want to be notified about your orders and offers.</p>

                            <div className="settings-group">
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Email Notifications</h4>
                                        <p>Order status, delivery updates, and news.</p>
                                    </div>
                                    <div className="toggle-switch">
                                        <input type="checkbox" id="email-notif" defaultChecked />
                                        <label htmlFor="email-notif"></label>
                                    </div>
                                </div>
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>SMS Notifications</h4>
                                        <p>Real-time delivery progress via SMS.</p>
                                    </div>
                                    <div className="toggle-switch">
                                        <input type="checkbox" id="sms-notif" />
                                        <label htmlFor="sms-notif"></label>
                                    </div>
                                </div>
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Push Notifications</h4>
                                        <p>App announcements and personalized offers.</p>
                                    </div>
                                    <div className="toggle-switch">
                                        <input type="checkbox" id="push-notif" defaultChecked />
                                        <label htmlFor="push-notif"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'localization' && (
                        <div className="settings-section">
                            <h2>Language & Localization Settings</h2>
                            <p className="section-desc">Local feels global—that’s product maturity.</p>

                            <div className="settings-group">
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Preferred Language</h4>
                                        <p>English (United States)</p>
                                    </div>
                                    <button className="btn-outline">Change</button>
                                </div>
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Preferred Currency</h4>
                                        <p>TZS - Tanzanian Shilling</p>
                                    </div>
                                    <button className="btn-outline" disabled>Default</button>
                                </div>
                                <div className="setting-tile">
                                    <div className="tile-info">
                                        <h4>Time Zone</h4>
                                        <p>(GMT+03:00) East Africa Time</p>
                                    </div>
                                    <button className="btn-outline">Update</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other sections */}
                    {!['account', 'privacy', 'notifications', 'localization'].includes(activeSection) && (
                        <div className="settings-placeholder" style={{ textAlign: 'center', padding: '5rem 0' }}>
                            <HelpCircle size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                            <h3>Coming Soon</h3>
                            <p style={{ color: '#64748b' }}>We're working on making these settings available for you.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Settings;
