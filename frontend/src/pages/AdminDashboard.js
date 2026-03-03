import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../utils/api';
import {
    Package, ShoppingBag, DollarSign, Plus, Edit, Trash2,
    LayoutDashboard, Users, Search, Upload, X, Settings as SettingsIcon,
    FileText, MessageCircle, TrendingUp, Briefcase, LogOut
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import './AdminDashboard.css';

const MOCK_CHART_DATA = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        revenueHistory: [],
        topProducts: []
    });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        base_price: '',
        discount: 0,
        category: '',
        stock: '',
        description: '',
        attributes: [],
        sku: '',
        brand: '',
        status: 'Active',
        price_depends_on_attribute: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [availableAttributes, setAvailableAttributes] = useState([]);

    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    const [statusNote, setStatusNote] = useState('');

    const [settings, setSettings] = useState({});

    useEffect(() => {
        fetchAdminData();
        fetchAttributes();
    }, []);

    const fetchOrderHistory = async (orderId) => {
        try {
            const res = await api.get(`/orders/${orderId}/history`);
            setStatusHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        fetchOrderHistory(order.id);
        setShowOrderDetails(true);
    };

    const handleUpdateStatus = async (status) => {
        try {
            await api.put(`/orders/${selectedOrder.id}/status`, {
                status,
                notes: statusNote || `Status updated to ${status}`
            });
            setStatusNote('');
            if (selectedOrder) {
                fetchOrderHistory(selectedOrder.id);
            }
            fetchAdminData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const fetchAttributes = async () => {
        try {
            const res = await api.get('/attributes');
            setAvailableAttributes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [sumRes, prodRes, ordRes, setRes, userRes, catRes] = await Promise.all([
                api.get('/admin/summary'),
                api.get('/products'),
                api.get('/orders'),
                api.get('/settings'),
                api.get('/users?role=customer'),
                api.get('/categories')
            ]);
            setSummary(sumRes.data);
            setProducts(prodRes.data);
            setOrders(ordRes.data);
            setCustomers(userRes.data || []);
            setCategories(catRes.data || []);

            const settingsMap = {};
            setRes.data.forEach(s => settingsMap[s.key] = s.value);
            setSettings(settingsMap);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setGalleryFiles(prev => [...prev, ...files]);
        const previews = files.map(f => URL.createObjectURL(f));
        setGalleryPreviews(prev => [...prev, ...previews]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('base_price', formData.base_price);
        data.append('discount', formData.discount);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        data.append('description', formData.description);
        data.append('sku', formData.sku);
        data.append('brand', formData.brand);
        data.append('status', formData.status);
        data.append('price_depends_on_attribute', formData.price_depends_on_attribute ? 1 : 0);
        data.append('attributes', JSON.stringify(formData.attributes));

        if (imageFile) data.append('image', imageFile);
        galleryFiles.forEach(file => data.append('gallery', file));

        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, data);
            } else {
                await api.post('/products', data);
            }
            closeForm();
            fetchAdminData();
        } catch (err) {
            console.error('API Error:', err.response?.data || err.message);
            alert('Action failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            name: '',
            base_price: '',
            discount: 0,
            category: '',
            stock: '',
            description: '',
            attributes: [],
            sku: '',
            brand: '',
            status: 'Active',
            price_depends_on_attribute: false
        });
        setImageFile(null);
        setImagePreview(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await api.delete(`/products/${id}`);
            fetchAdminData();
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            base_price: product.base_price,
            discount: product.discount || 0,
            category: product.category,
            stock: product.stock,
            description: product.description,
            attributes: product.attributes?.map(a => a.id) || [],
            sku: product.sku || '',
            brand: product.brand || '',
            status: product.status || 'Active',
            price_depends_on_attribute: !!product.price_depends_on_attribute
        });
        setImagePreview(product.image_url ? `${BASE_URL}${product.image_url}` : null);
        setGalleryPreviews(product.gallery_urls?.map(url => `${BASE_URL}${url}`) || []);
        setShowForm(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="admin-layout flex items-center justify-center">Loading Dashboard...</div>;

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <Briefcase size={32} />
                    <span>DUKA Pro</span>
                </div>
                <nav className="sidebar-nav">
                    <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={20} /> Overview
                    </div>
                    <div className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                        <ShoppingBag size={20} /> Orders
                    </div>
                    <div className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                        <Package size={20} /> Products
                    </div>
                    <div className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
                        <LayoutDashboard size={20} /> Categories
                    </div>
                    <div className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
                        <Users size={20} /> Customers
                    </div>
                    <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                        <SettingsIcon size={20} /> System Settings
                    </div>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="nav-item" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>
                        <LogOut size={20} /> Sign Out
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <div className="header-row">
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>
                            {activeTab === 'dashboard' ? 'Market Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.4rem' }}>
                            Manage your commerce operations and tracking
                        </p>
                    </div>
                    {activeTab === 'products' && (
                        <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Add New Entry
                        </button>
                    )}
                </div>

                {activeTab === 'dashboard' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon" style={{ backgroundColor: '#f0f9ff', color: '#0ea5e9' }}>
                                    <DollarSign size={24} />
                                </div>
                                <div className="stat-info">
                                    <h3>Gross Revenue</h3>
                                    <p>TZS {Number(summary.totalSales).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#10b981' }}>
                                    <ShoppingBag size={24} />
                                </div>
                                <div className="stat-info">
                                    <h3>Active Orders</h3>
                                    <p>{summary.totalOrders}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                                    <Users size={24} />
                                </div>
                                <div className="stat-info">
                                    <h3>Customer Base</h3>
                                    <p>{summary.totalCustomers || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="chart-container" style={{ marginBottom: '2.5rem' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontWeight: '700', fontSize: '1.1rem' }}>Revenue Trends (Last 7 Days)</h3>
                                <div className="flex items-center gap-2" style={{ color: '#10b981', background: '#f0fdf4', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    <TrendingUp size={16} /> +12.5% vs Last Week
                                </div>
                            </div>
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={summary.revenueHistory && summary.revenueHistory.length > 0 ? summary.revenueHistory : MOCK_CHART_DATA}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey={summary.revenueHistory?.length > 0 ? "date" : "name"}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            dy={10}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                            cursor={{ stroke: '#0ea5e9', strokeWidth: 2 }}
                                        />
                                        <Area type="monotone" dataKey={summary.revenueHistory?.length > 0 ? "amount" : "revenue"} stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                            <div className="content-section">
                                <div className="section-padding" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <h3 style={{ fontWeight: '700' }}>Recent Transactions</h3>
                                </div>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Ref #</th>
                                            <th>Client</th>
                                            <th>Value</th>
                                            <th>State</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 6).map(o => (
                                            <tr key={o.id} onClick={() => handleViewOrder(o)} style={{ cursor: 'pointer' }}>
                                                <td style={{ fontWeight: 'bold' }}>#{o.order_number || o.id}</td>
                                                <td>{o.customer_name}</td>
                                                <td>TZS {Number(o.total_price).toLocaleString()}</td>
                                                <td>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '30px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: '800',
                                                        backgroundColor: o.status === 'Completed' ? '#dcfce7' : o.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                                                        color: o.status === 'Completed' ? '#166534' : o.status === 'Cancelled' ? '#991b1b' : '#92400e',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="content-section">
                                <div className="section-padding" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <h3 style={{ fontWeight: '700' }}>Top Performing Items</h3>
                                </div>
                                <div className="section-padding">
                                    {summary.topProducts?.map((p, i) => (
                                        <div key={i} className="flex items-center justify-between" style={{ padding: '1rem 0', borderBottom: i < summary.topProducts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                            <div>
                                                <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{p.name}</p>
                                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.orders_count} Orders</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontWeight: '800', color: 'var(--primary)' }}>{p.total_units} Sold</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!summary.topProducts || summary.topProducts.length === 0) && (
                                        <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No sales data available yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'orders' && (
                    <div className="content-section">
                        <div className="section-padding">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id} onClick={() => handleViewOrder(o)} style={{ cursor: 'pointer' }}>
                                            <td style={{ fontWeight: 'bold' }}>{o.order_number || `#${o.id}`}</td>
                                            <td>
                                                <div>{o.customer_name || o.user_name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{o.customer_phone}</div>
                                            </td>
                                            <td>TZS {Number(o.total_price).toLocaleString()}</td>
                                            <td>
                                                <span className="badge" style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: o.status === 'Completed' ? '#dcfce7' : o.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                                                    color: o.status === 'Completed' ? '#166534' : o.status === 'Cancelled' ? '#991b1b' : '#92400e'
                                                }}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                                                    <a
                                                        href={`${BASE_URL}/orders/Order_${o.order_number}.pdf`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="nav-item"
                                                        style={{ padding: '6px' }}
                                                        title="Download PDF"
                                                    >
                                                        <FileText size={16} />
                                                    </a>
                                                    <a
                                                        href={`https://wa.me/${o.customer_phone?.replace('+', '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="nav-item"
                                                        style={{ padding: '6px', color: '#25d366' }}
                                                        title="WhatsApp"
                                                    >
                                                        <MessageCircle size={16} />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="content-section">
                        <div className="section-padding">
                            <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontWeight: '700' }}>Product Categories</h3>
                                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Plus size={18} /> Add Category
                                </button>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Products</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(cat => (
                                        <tr key={cat.id}>
                                            <td>#{cat.id}</td>
                                            <td style={{ fontWeight: 'bold' }}>{cat.name}</td>
                                            <td>{cat.description || 'No description'}</td>
                                            <td>{products.filter(p => p.category === cat.name).length} Items</td>
                                            <td>
                                                <div className="flex" style={{ gap: '0.5rem' }}>
                                                    <button className="icon-btn" title="Edit"><Edit size={16} /></button>
                                                    <button className="icon-btn text-danger" title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {activeTab === 'customers' && (
                    <div className="content-section">
                        <div className="section-padding">
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>User Management</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map(u => (
                                        <tr key={u.id}>
                                            <td>#{u.id}</td>
                                            <td style={{ fontWeight: 'bold' }}>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.phone || 'N/A'}</td>
                                            <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && <SettingsModule />}
            </main>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="flex justify-between items-start" style={{ marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Order <span style={{ color: 'var(--primary)' }}>#{selectedOrder.order_number || selectedOrder.id}</span></h2>
                                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Placed on {new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setShowOrderDetails(false)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}>
                                <X size={24} color="#64748b" />
                            </button>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                            <div>
                                <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '700' }}>Order Items</h3>
                                    {selectedOrder.items?.map((item, i) => (
                                        <div key={i} className="flex" style={{ justifyContent: 'space-between', padding: '1rem 0', borderBottom: i < selectedOrder.items.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: '700', fontSize: '1rem' }}>{item.product_name} <span style={{ color: 'var(--secondary)', fontWeight: '500' }}>x{item.quantity}</span></p>
                                                {item.selected_attributes && Object.keys(item.selected_attributes).length > 0 && (
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: '0.2rem' }}>
                                                        {Object.entries(item.selected_attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                            <p style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--foreground)' }}>TZS {Number(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                    <div className="flex" style={{ justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2.5px solid #e2e8f0' }}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>Total Amount</span>
                                        <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)' }}>TZS {Number(selectedOrder.total_price).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div style={{ border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '1rem' }}>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>Customer Information</h3>
                                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</p>
                                            <p style={{ fontWeight: '600' }}>{selectedOrder.customer_name}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</p>
                                            <p style={{ fontWeight: '600' }}>{selectedOrder.customer_phone}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Type</p>
                                            <p style={{ fontWeight: '600' }}>{selectedOrder.delivery_type}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</p>
                                            <p style={{ fontWeight: '600' }}>{selectedOrder.delivery_location || 'Pickup'}</p>
                                        </div>
                                    </div>
                                    {selectedOrder.order_notes && (
                                        <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '12px', border: '1px solid #fde68a', marginTop: '1.5rem' }}>
                                            <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#92400e', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Buyer Special Notes:</p>
                                            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', lineHeight: '1.5' }}>"{selectedOrder.order_notes}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="status-sidebar">
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '700' }}>History Tracking</h3>
                                <div className="timeline" style={{ paddingLeft: '0.5rem' }}>
                                    {statusHistory.map((h, i) => (
                                        <div key={i} style={{ position: 'relative', paddingLeft: '1.75rem', paddingBottom: '2rem' }}>
                                            <div style={{ position: 'absolute', left: '0', top: '0', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: i === 0 ? 'var(--primary)' : '#cbd5e1', zIndex: 1, border: '3px solid white', boxShadow: '0 0 0 1px #e2e8f0' }}></div>
                                            {i < statusHistory.length - 1 && <div style={{ position: 'absolute', left: '6px', top: '14px', width: '2px', height: '100%', backgroundColor: '#e2e8f0' }}></div>}
                                            <p style={{ fontWeight: '700', fontSize: '0.95rem', color: i === 0 ? 'var(--foreground)' : 'var(--secondary)' }}>{h.status}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>{new Date(h.changed_at).toLocaleString()}</p>
                                            {h.notes && <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>{h.notes}</p>}
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '2px dashed #e2e8f0' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem' }}>Update Order State</h4>
                                    <textarea
                                        className="search-input"
                                        placeholder="Add internal progress note..."
                                        style={{ fontSize: '0.875rem', marginBottom: '1rem', minHeight: '80px', borderRadius: '0.75rem' }}
                                        value={statusNote}
                                        onChange={e => setStatusNote(e.target.value)}
                                    />
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { s: 'Payment Confirmed', c: '#3b82f6' },
                                            { s: 'Ready', c: '#8b5cf6' },
                                            { s: 'Out for Delivery', c: '#f59e0b' },
                                            { s: 'Completed', c: '#10b981' },
                                            { s: 'Cancelled', c: '#ef4444' }
                                        ].map(item => (
                                            <button
                                                key={item.s}
                                                className="btn btn-secondary btn-sm"
                                                style={{ justifyContent: 'center', fontWeight: '600', border: `1px solid ${item.c}`, color: item.c }}
                                                onClick={() => handleUpdateStatus(item.s)}
                                            >
                                                Set as {item.s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};


const SettingsModule = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            setSettings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (key, value) => {
        setSaving(true);
        try {
            await api.post('/settings', { key, value });
            await fetchSettings();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="section-padding">Loading settings...</div>;

    return (
        <div className="content-section">
            <div className="section-padding" style={{ borderBottom: '1px solid var(--border)' }}>
                <h2>System Settings</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Manage your business information and automation preferences.</p>
            </div>
            <div className="section-padding">
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {settings.map(s => (
                        <div key={s.id} className="flex flex-col gap-2 p-4" style={{ backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#1e293b' }}>
                                {s.key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </label>
                            <input
                                className="search-input"
                                value={s.value}
                                onChange={(e) => {
                                    const newSettings = settings.map(item => item.id === s.id ? { ...item, value: e.target.value } : item);
                                    setSettings(newSettings);
                                }}
                                onBlur={(e) => handleUpdate(s.key, e.target.value)}
                                disabled={saving}
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Updated: {new Date(s.updated_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                {saving && <p style={{ marginTop: '1rem', color: 'var(--primary)', fontSize: '0.8rem' }}>Saving changes...</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;
