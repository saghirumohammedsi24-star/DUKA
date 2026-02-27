import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (query = '') => {
        setLoading(true);
        try {
            const res = await api.get(`/products?search=${query}`);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(search);
    };

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="container">
            <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Discover Our Products</h1>
                <form onSubmit={handleSearch} className="flex" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '5px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="input"
                        style={{ border: 'none', marginBottom: 0, padding: '0.75rem' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px' }}>
                        <Search size={20} />
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                    <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Loading premium collection...</p>
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {products.map(product => (
                        <div key={product.id} onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="flex flex-col items-center justify-center" style={{ gridColumn: '1 / -1', padding: '4rem 0' }}>
                            <p style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>No products found matching "{search}"</p>
                            <button onClick={() => { setSearch(''); fetchProducts(); }} className="btn" style={{ marginTop: '1rem', color: 'var(--primary)' }}>Clear all filters</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Products;
