import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from '../utils/api';
import {
    Package, ShoppingBag, DollarSign, Plus, Edit, Trash2,
    LayoutDashboard, Users, Search, Upload, X
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
    const [summary, setSummary] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0 });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', category: '', stock: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [sumRes, prodRes, ordRes] = await Promise.all([
                api.get('/admin/summary'),
                api.get('/products'),
                api.get('/orders')
            ]);
            setSummary(sumRes.data);
            setProducts(prodRes.data);
            setOrders(ordRes.data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        data.append('description', formData.description);
        if (imageFile) {
            data.append('image', imageFile);
        }

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
        setFormData({ name: '', price: '', category: '', stock: '', description: '' });
        setImageFile(null);
        setImagePreview(null);
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
            price: product.price,
            category: product.category,
            stock: product.stock,
            description: product.description
        });
        setImagePreview(product.image_url ? `${BASE_URL}${product.image_url}` : null);
        setShowForm(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="admin-layout flex items-center justify-center">Loading Dashboard...</div>;

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">DUKA Admin</div>
                <nav className="sidebar-nav">
                    <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={20} /> Dashboard
                    </div>
                    <div className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                        <ShoppingBag size={20} /> Orders
                    </div>
                    <div className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                        <Package size={20} /> Products
                    </div>
                    <div className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
                        <Users size={20} /> Customers
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <div className="header-row">
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    {activeTab === 'products' && (
                        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                            <Plus size={20} /> Add Product
                        </button>
                    )}
                </div>

                {activeTab === 'dashboard' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon" style={{ backgroundColor: '#ebf5ff', color: '#2563eb' }}>
                                    <DollarSign size={24} />
                                </div>
                                <div className="stat-info">
                                    <h3>Total Sales</h3>
                                    <p>TZS {summary.totalSales}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                                    <ShoppingBag size={24} />
                                </div>
                                <div className="stat-info">
                                    <h3>Total Orders</h3>
                                    <p>{summary.totalOrders}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                                    <Package size={24} />
                                </div>
                                <div className="stat-info">
                                    <h3>Total Products</h3>
                                    <p>{summary.totalProducts}</p>
                                </div>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Monthly Revenue</h2>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={MOCK_CHART_DATA}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ stroke: '#2563eb', strokeWidth: 1 }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="content-section">
                            <div className="section-padding" style={{ borderBottom: '1px solid var(--border)' }}>
                                <h2>Recent Orders</h2>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map(o => (
                                        <tr key={o.id}>
                                            <td>#{o.id}</td>
                                            <td>{o.customer_name}</td>
                                            <td>TZS {o.total_price}</td>
                                            <td>
                                                <span className="badge" style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: o.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                                                    color: o.status === 'Completed' ? '#166534' : '#92400e'
                                                }}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'products' && (
                    <div className="content-section">
                        <div className="section-padding">
                            <div className="search-bar">
                                <Search size={18} color="var(--secondary)" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search products by name or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(p => (
                                        <tr key={p.id}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                {p.image_url ? (
                                                    <img src={`${BASE_URL}${p.image_url}`} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={16} /></div>
                                                )}
                                                <span style={{ fontWeight: '500' }}>{p.name}</span>
                                            </td>
                                            <td>{p.category}</td>
                                            <td>TZS {p.price}</td>
                                            <td>{p.stock}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => handleEdit(p)} className="nav-item" style={{ padding: '6px' }}><Edit size={16} /></button>
                                                    <button onClick={() => handleDelete(p.id)} className="nav-item" style={{ padding: '6px', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Product Name</label>
                                    <input type="text" className="search-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Price (TZS)</label>
                                    <input type="number" step="0.01" className="search-input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Category</label>
                                    <input type="text" className="search-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Stock</label>
                                    <input type="number" className="search-input" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Description</label>
                                <textarea
                                    className="search-input"
                                    rows="3"
                                    style={{ resize: 'none' }}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-2" style={{ marginBottom: '2rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Product Image</label>
                                <div className="upload-zone" onClick={() => document.getElementById('imageInput').click()}>
                                    <Upload size={32} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
                                    <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Click to upload or drag and drop</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '0.25rem' }}>PNG, JPG or WEBP (MAX. 5MB)</p>
                                    <input id="imageInput" type="file" hidden onChange={handleImageChange} accept="image/*" />
                                    {imagePreview && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <img src={imagePreview} alt="Preview" className="preview-img" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4" style={{ justifyContent: 'flex-end' }}>
                                <button type="button" className="btn" style={{ backgroundColor: 'var(--accent)', color: 'var(--text)' }} onClick={closeForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                                    {editingId ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div >
                </div >
            )}
        </div >
    );
};

export default AdminDashboard;
