import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../utils/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [activeImage, setActiveImage] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const fetchReviews = async (productId) => {
        try {
            const res = await api.get(`/reviews/${productId}`);
            setReviews(res.data.reviews || []);
            setAvgRating(res.data.stats?.avg_rating || 0);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
                setActiveImage(res.data.image_url);
                fetchReviews(res.data.id);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, fetchReviews]); // Included fetchReviews in dependency array for best practice

    if (loading) return <div className="p-loading">Loading...</div>;
    if (!product) return <div className="p-notfound">Product not found.</div>;

    // Calculate Dynamic Price
    let currentPrice = Number(product.price);
    if (product.price_depends_on_attribute) {
        Object.values(selectedOptions).forEach(opt => {
            currentPrice += Number(opt.price_modifier || 0);
        });
    }

    const groupedAttributes = product.attributes ? product.attributes.reduce((acc, curr) => {
        if (!acc[curr.attribute_name]) acc[curr.attribute_name] = [];
        acc[curr.attribute_name].push(curr);
        return acc;
    }, {}) : {};

    const handleAttributeSelect = (name, option) => {
        setSelectedAttributes(prev => ({ ...prev, [name]: option.value }));
        setSelectedOptions(prev => ({ ...prev, [name]: option }));
        if (option.media_url) {
            setActiveImage(option.media_url);
        }
    };

    const handleAddToWishlist = async () => {
        try {
            await api.post('/wishlist', { product_id: product.id });
            alert('Added to wishlist!');
        } catch (err) {
            console.error(err);
            alert('Please login to save items.');
        }
    };

    const mainImageUrl = activeImage
        ? (activeImage.startsWith('http') ? activeImage : `${BASE_URL}${activeImage}`)
        : (product.image_url.startsWith('http') ? product.image_url : `${BASE_URL}${product.image_url}`);

    return (
        <div className="pd-page container">
            <button onClick={() => navigate(-1)} className="pd-back-btn">
                <ArrowLeft size={18} /> Back to Shop
            </button>

            <div className="pd-grid">
                {/* Image Section */}
                <div className="pd-media">
                    <div className="pd-main-img-wrap">
                        <img src={mainImageUrl} alt={product.name} className="pd-main-img" />
                        {product.discount > 0 && <div className="pd-discount-badge">-{Number(product.discount).toLocaleString()} OFF</div>}
                    </div>
                    {product.gallery_urls && product.gallery_urls.length > 0 && (
                        <div className="pd-gallery">
                            <div
                                className={`pd-thumb ${activeImage === product.image_url ? 'active' : ''}`}
                                onClick={() => setActiveImage(product.image_url)}
                            >
                                <img src={`${BASE_URL}${product.image_url}`} alt="Thumbnail" />
                            </div>
                            {product.gallery_urls.map((url, i) => (
                                <div
                                    key={i}
                                    className={`pd-thumb ${activeImage === url ? 'active' : ''}`}
                                    onClick={() => setActiveImage(url)}
                                >
                                    <img src={`${BASE_URL}${url}`} alt={`Thumb ${i}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="pd-info">
                    <div className="pd-header">
                        <div className="flex justify-between items-start">
                            <span className="pd-category-badge">{product.brand ? `${product.brand} | ` : ''}{product.category}</span>
                            <button onClick={handleAddToWishlist} className="pd-wish-btn" title="Add to Wishlist">❤</button>
                        </div>
                        <h1 className="pd-title">{product.name}</h1>
                        <p className="pd-sku">SKU: {product.sku || product.automatic_id}</p>

                        <div className="pd-price-wrap">
                            {product.discount > 0 && <span className="pd-base-price">TZS {Number(product.base_price).toLocaleString()}</span>}
                            <h2 className="pd-price">TZS {currentPrice.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="pd-divider"></div>

                    <p className="pd-description">{product.description}</p>

                    {/* Attributes */}
                    <div className="pd-attributes">
                        {Object.entries(groupedAttributes).map(([name, options]) => (
                            <div key={name} className="pd-attr-group">
                                <label className="pd-attr-label">
                                    {name}
                                    {selectedOptions[name]?.price_modifier > 0 &&
                                        <span className="pd-attr-modifier"> (+{Number(selectedOptions[name].price_modifier).toLocaleString()})</span>
                                    }
                                </label>
                                <div className="pd-attr-options">
                                    {options.map((opt, i) => (
                                        <button
                                            key={i}
                                            className={`pd-attr-btn ${selectedAttributes[name] === opt.value ? 'active' : ''}`}
                                            onClick={() => handleAttributeSelect(name, opt)}
                                            style={name.toLowerCase() === 'color' && opt.media_type === 'text' ? { '--color': opt.value } : {}}
                                        >
                                            {opt.media_type === 'image' && opt.media_url ? (
                                                <img src={`${BASE_URL}${opt.media_url}`} alt={opt.value} className="pd-attr-img" />
                                            ) : (
                                                <span>{opt.value}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pd-actions">
                        <div className="pd-qty-selector">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                        <button
                            onClick={() => {
                                if (product.status === 'Active' && product.stock > 0) {
                                    addToCart(product, quantity, selectedAttributes, currentPrice);
                                    navigate('/cart');
                                }
                            }}
                            className={`pd-add-btn ${product.status !== 'Active' || product.stock <= 0 ? 'disabled' : ''}`}
                            disabled={product.status !== 'Active' || product.stock <= 0}
                        >
                            <ShoppingCart size={20} /> {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>

                    <div className="pd-footer">
                        <p className={product.stock < 5 ? 'text-danger' : ''}>✓ Availability: {product.status === 'Active' ? `${product.stock} units in stock` : product.status}</p>
                        <p>✓ 100% Genuine Product</p>
                        <p>✓ Direct Delivery Available</p>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="pd-reviews-section" style={{ marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid #e2e8f0' }}>
                <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Customer Reviews</h2>
                    <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{Number(avgRating).toFixed(1)}</span>
                        <div style={{ color: '#f59e0b' }}>{"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}</div>
                        <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>({reviews.length} reviews)</span>
                    </div>
                </div>

                <div className="pd-reviews-list">
                    {reviews.length > 0 ? reviews.map((r, i) => (
                        <div key={i} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: i < reviews.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '700' }}>{r.user_name}</span>
                                <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                            </div>
                            <div style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                            <p style={{ color: 'var(--foreground)', lineHeight: '1.6' }}>{r.comment}</p>
                        </div>
                    )) : (
                        <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: '2rem' }}>No reviews yet. Be the first to leave one!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
