import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Package, MapPin, Heart, History, TrendingUp, ChevronRight } from 'lucide-react';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const profileRes = await api.get('/users/profile');
            const ordersRes = await api.get('/orders/user');
            setProfile(profileRes.data);
            setOrders(ordersRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-loading">Loading Dashboard...</div>;

    return (
        <div className="cd-page container">
            <header className="cd-header">
                <div>
                    <h1>Habari, {profile?.display_name || profile?.name}! 👋</h1>
                    <p>Good to see you again. Here's what's happening with your account.</p>
                </div>
                <button onClick={() => navigate('/profile')} className="btn btn-secondary">Edit Profile</button>
            </header>

            <div className="cd-stats-grid">
                <div className="cd-stat-card primary">
                    <TrendingUp size={24} />
                    <div className="cd-stat-info">
                        <h3>Loyalty Points</h3>
                        <p>{profile?.loyalty_points || 0} Points</p>
                    </div>
                </div>
                <div className="cd-stat-card success">
                    <Package size={24} />
                    <div className="cd-stat-info">
                        <h3>Total Orders</h3>
                        <p>{profile?.total_orders || 0} Orders</p>
                    </div>
                </div>
                <div className="cd-stat-card warning">
                    <Package size={24} />
                    <div className="cd-stat-info">
                        <h3>Active Orders</h3>
                        <p>{orders.filter(o => !['Completed', 'Cancelled'].includes(o.status)).length} Active</p>
                    </div>
                </div>
            </div>

            <div className="cd-main-grid">
                {/* Recent Orders */}
                <div className="cd-section">
                    <div className="cd-section-header">
                        <h2><History size={20} /> Recent Orders</h2>
                        <button onClick={() => navigate('/profile?tab=orders')} className="cd-view-all">View All</button>
                    </div>

                    <div className="cd-orders-list">
                        {orders.slice(0, 5).map(order => (
                            <div key={order.id} className="cd-order-item" onClick={() => navigate(`/orders/${order.id}`)}>
                                <div className="cd-order-main">
                                    <div className={`cd-status-dot ${order.status.toLowerCase()}`}></div>
                                    <div>
                                        <p className="cd-order-num">#{order.order_number || order.id}</p>
                                        <p className="cd-order-date">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="cd-order-meta">
                                    <p className="cd-order-price">TZS {Number(order.total_price).toLocaleString()}</p>
                                    <p className={`cd-order-status ${order.status.toLowerCase()}`}>{order.status}</p>
                                </div>
                                <div className="cd-order-actions" style={{ marginLeft: '1rem' }} onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => {
                                            // Simulated reorder: in production we'd fetch order items and add to cart
                                            alert("Reorder functionality starting... redirecting to cart.");
                                            navigate('/cart');
                                        }}
                                    >
                                        Reorder
                                    </button>
                                </div>
                                <ChevronRight size={18} className="cd-order-arrow" />
                            </div>
                        ))}
                        {orders.length === 0 && <p className="cd-empty">No orders found.</p>}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="cd-sidebar">
                    <div className="cd-section">
                        <h2>Quick Actions</h2>
                        <div className="cd-actions-grid">
                            <button className="cd-action-btn" onClick={() => navigate('/wishlist')}>
                                <Heart size={20} />
                                <span>Wishlist</span>
                            </button>
                            <button className="cd-action-btn" onClick={() => navigate('/profile?tab=addresses')}>
                                <MapPin size={20} />
                                <span>Addresses</span>
                            </button>
                        </div>
                    </div>

                    <div className="cd-section cd-banner">
                        <h3>DUKA Rewards 🌟</h3>
                        <p>Keep shopping to earn more points and unlock special discounts!</p>
                        <button className="btn btn-primary btn-sm">Learn More</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
