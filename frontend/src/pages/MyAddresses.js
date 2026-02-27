import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    MapPin, Plus, Trash2, Save, X, CheckCircle, Home, Briefcase, Star
} from 'lucide-react';
import './MyAddresses.css';

const MyAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState(null);
    const [form, setForm] = useState({
        full_address: '', city_region_zone: '', postal_code: '', country: 'Tanzania', is_default: false
    });

    useEffect(() => { fetchAddresses(); }, []);

    const fetchAddresses = async () => {
        try {
            const res = await api.get('/users/addresses');
            setAddresses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!form.full_address || !form.city_region_zone) {
            setMessage({ type: 'error', text: 'Please fill address and city/region.' });
            return;
        }
        try {
            await api.post('/users/addresses', form);
            setMessage({ type: 'success', text: 'Address added successfully!' });
            setShowForm(false);
            setForm({ full_address: '', city_region_zone: '', postal_code: '', country: 'Tanzania', is_default: false });
            fetchAddresses();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to add address.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this address?')) return;
        try {
            await api.delete(`/users/addresses/${id}`);
            setAddresses(addresses.filter(a => a.id !== id));
            setMessage({ type: 'success', text: 'Address removed.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete.' });
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.put(`/users/addresses/${id}/default`);
            fetchAddresses();
            setMessage({ type: 'success', text: 'Default address updated.' });
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className="loading-spinner"></div>
        </div>;
    }

    return (
        <div className="addr-page">
            {/* Header */}
            <div className="addr-header">
                <div>
                    <h1 className="addr-title">My Addresses</h1>
                    <p className="addr-subtitle">Manage your delivery addresses for faster checkout.</p>
                </div>
                <button className="addr-add-btn" onClick={() => { setShowForm(!showForm); setMessage(null); }}>
                    {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Address</>}
                </button>
            </div>

            {/* Toast */}
            {message && (
                <div className={`pf-toast ${message.type}`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage(null)}><X size={16} /></button>
                </div>
            )}

            {/* Add Form */}
            {showForm && (
                <div className="addr-form-card">
                    <h3 className="addr-form-title"><MapPin size={18} /> New Address</h3>
                    <div className="addr-form-grid">
                        <div className="addr-field full">
                            <label>Full Address *</label>
                            <input type="text" placeholder="Street name, house number, area..."
                                value={form.full_address} onChange={e => setForm({ ...form, full_address: e.target.value })} />
                        </div>
                        <div className="addr-field">
                            <label>City / Region / Zone *</label>
                            <input type="text" placeholder="e.g. Dar es Salaam, Kinondoni"
                                value={form.city_region_zone} onChange={e => setForm({ ...form, city_region_zone: e.target.value })} />
                        </div>
                        <div className="addr-field">
                            <label>Postal Code</label>
                            <input type="text" placeholder="Optional"
                                value={form.postal_code} onChange={e => setForm({ ...form, postal_code: e.target.value })} />
                        </div>
                        <div className="addr-field">
                            <label>Country</label>
                            <input type="text" value={form.country}
                                onChange={e => setForm({ ...form, country: e.target.value })} />
                        </div>
                        <div className="addr-field">
                            <label className="addr-checkbox">
                                <input type="checkbox" checked={form.is_default}
                                    onChange={e => setForm({ ...form, is_default: e.target.checked })} />
                                Set as default delivery address
                            </label>
                        </div>
                    </div>
                    <button className="addr-save-btn" onClick={handleAdd}>
                        <Save size={15} /> Save Address
                    </button>
                </div>
            )}

            {/* Address List */}
            {addresses.length === 0 && !showForm ? (
                <div className="addr-empty">
                    <div className="addr-empty-icon">
                        <MapPin size={48} strokeWidth={1} />
                    </div>
                    <h3>No addresses yet</h3>
                    <p>Add your delivery address to make checkout faster and easier.</p>
                    <button className="addr-add-btn" onClick={() => setShowForm(true)}>
                        <Plus size={16} /> Add Your First Address
                    </button>
                </div>
            ) : (
                <div className="addr-grid">
                    {addresses.map(addr => (
                        <div key={addr.id} className={`addr-card ${addr.is_default ? 'default' : ''}`}>
                            <div className="addr-card-top">
                                <div className="addr-icon-wrap">
                                    <Home size={20} />
                                </div>
                                {addr.is_default && (
                                    <span className="addr-default-badge">
                                        <CheckCircle size={12} /> Default
                                    </span>
                                )}
                            </div>
                            <div className="addr-card-body">
                                <p className="addr-street">{addr.full_address}</p>
                                <p className="addr-region">{addr.city_region_zone}{addr.postal_code ? `, ${addr.postal_code}` : ''}</p>
                                <p className="addr-country">{addr.country}</p>
                            </div>
                            <div className="addr-card-actions">
                                {!addr.is_default && (
                                    <button className="addr-action-btn primary" onClick={() => handleSetDefault(addr.id)}>
                                        <Star size={14} /> Set Default
                                    </button>
                                )}
                                <button className="addr-action-btn danger" onClick={() => handleDelete(addr.id)}>
                                    <Trash2 size={14} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAddresses;
