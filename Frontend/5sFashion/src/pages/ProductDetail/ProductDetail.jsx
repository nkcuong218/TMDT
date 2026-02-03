import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './ProductDetail.css';

// Import Mocks
import p1 from '../../assets/product1.jpg';
import p2 from '../../assets/product2.jpg';
import p3 from '../../assets/product3.png';
import p4 from '../../assets/product4.png';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Mock Fetch
    useEffect(() => {
        window.scrollTo(0, 0);
        // Simulate API fetch delay
        setTimeout(() => {
            const mockProduct = {
                id: id,
                title: 'Quần Short Kaki Nam 5S Fashion Cạp Cúc Ẩn QSK24014RA',
                sku: 'QSK24014RA',
                price: 299000,
                originalPrice: 395000,
                discount: 24,
                images: [p1, p2, p3, p4, p1], // Mock multiple images
                colors: [
                    { name: 'Xanh Rêu', code: '#556b2f' },
                    { name: 'Be', code: '#f5f5dc' },
                    { name: 'Đen', code: '#000000' },
                    { name: 'Xám', code: '#808080' }
                ],
                sizes: [29, 30, 31, 32, 33, 34, 35]
            };
            setProduct(mockProduct);
            setSelectedImage(mockProduct.images[0]);
            setSelectedColor(mockProduct.colors[0].name);
            setSelectedSize(mockProduct.sizes[1]); // Default to 30
        }, 300);
    }, [id]);

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    if (!product) return (
        <Layout>
            <div style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading...
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="product-detail-page">
                <div className="pd-container">
                    {/* Breadcrumbs */}
                    <div className="pd-breadcrumbs">
                        <Link to="/">Trang chủ</Link>
                        <span>/</span>
                        <Link to="/products">Nam</Link>
                        <span>/</span>
                        <Link to="/category/quan-shorts-nam">Quần Shorts</Link>
                        <span>/</span>
                        <span style={{ color: '#333' }}>{product.title}</span>
                    </div>

                    <div className="pd-layout">
                        {/* Left: Gallery */}
                        <div className="pd-gallery">
                            <div className="pd-thumbnails">
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`pd-thumb-item ${selectedImage === img ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img src={img} alt={`Thumb ${idx}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="pd-main-image">
                                <img src={selectedImage} alt={product.title} />
                            </div>
                        </div>

                        {/* Right: Info */}
                        <div className="pd-info">
                            <h1 className="pd-title">{product.title}</h1>
                            <div className="pd-meta">
                                <span>Mã: <b>{product.sku}</b></span>
                                <span>Tình trạng: <b>Còn hàng</b></span>
                                <span>Thương hiệu: <b>5S Fashion</b></span>
                            </div>

                            <div className="pd-price-box">
                                <span className="pd-current-price">{product.price.toLocaleString()}đ</span>
                                <span className="pd-old-price">{product.originalPrice.toLocaleString()}đ</span>
                                <span className="pd-discount-badge">-{product.discount}%</span>
                            </div>

                            {/* Options */}
                            <div className="pd-option-group">
                                <label className="pd-option-label">MÀU SẮC: {selectedColor}</label>
                                <div className="pd-colors">
                                    {product.colors.map((color) => (
                                        <div
                                            key={color.name}
                                            className={`pd-color-item ${selectedColor === color.name ? 'active' : ''}`}
                                            style={{ backgroundColor: color.code }}
                                            onClick={() => setSelectedColor(color.name)}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="pd-option-group">
                                <label className="pd-option-label">KÍCH CỠ: {selectedSize}</label>
                                <div className="pd-sizes">
                                    {product.sizes.map((size) => (
                                        <div
                                            key={size}
                                            className={`pd-size-item ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ fontSize: '12px', marginTop: '10px', textDecoration: 'underline', cursor: 'pointer' }}>
                                    Hướng dẫn chọn size
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="pd-option-group">
                                <label className="pd-option-label">SỐ LƯỢNG</label>
                                <div className="pd-quantity-wrapper">
                                    <button className="pd-qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                                    <input type="text" className="pd-qty-input" value={quantity} readOnly />
                                    <button className="pd-qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pd-actions">
                                <button className="pd-btn pd-btn-cart">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-7-4h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-.7-2H5.5M4 4h2.5l3.5 10h8.5" /></svg>
                                    THÊM VÀO GIỎ
                                </button>
                                <button className="pd-btn pd-btn-buy">
                                    MUA NGAY
                                </button>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetail;
