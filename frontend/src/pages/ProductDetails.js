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
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [activeImage, setActiveImage] = useState(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
                setActiveImage(res.data.image_url);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="p-loading">Loading...</div>;
    if (!product) return <div className="p-notfound">Product not found.</div>;

    // Group attributes by name
    const groupedAttributes = product.attributes ? product.attributes.reduce((acc, curr) => {
        if (!acc[curr.attribute_name]) acc[curr.attribute_name] = [];
        acc[curr.attribute_name].push(curr);
        return acc;
    }, {}) : {};

    const handleAttributeSelect = (name, option) => {
        setSelectedAttributes(prev => ({ ...prev, [name]: option.value }));
        if (option.media_url) {
            setActiveImage(option.media_url);
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
                        <span className="pd-category-badge">{product.category}</span>
                        <h1 className="pd-title">{product.name}</h1>
                        <p className="pd-sku">Product ID: {product.automatic_id || `DUKA-${product.id}`}</p>
                        <p className="pd-price">TZS {Number(product.price).toLocaleString()}</p>
                    </div>

                    <div className="pd-divider"></div>

                    <p className="pd-description">{product.description}</p>

                    {/* Attributes */}
                    <div className="pd-attributes">
                        {Object.entries(groupedAttributes).map(([name, options]) => (
                            <div key={name} className="pd-attr-group">
                                <label className="pd-attr-label">{name}</label>
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
                                addToCart(product, quantity, selectedAttributes);
                                navigate('/cart');
                            }}
                            className="pd-add-btn"
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                    </div>

                    <div className="pd-footer">
                        <p>✓ In Stock: {product.stock} units</p>
                        <p>✓ 100% Genuine Product</p>
                        <p>✓ Direct Delivery Available</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
