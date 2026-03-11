import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { addToCart, formatCurrency, getProductById, getVariantsByProductId } from '../../services/catalogApi';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadDetail = async () => {
            try {
                setLoading(true);
                setError('');
                window.scrollTo(0, 0);

                const [productData, variantData] = await Promise.all([
                    getProductById(id),
                    getVariantsByProductId(id),
                ]);

                if (!isMounted) {
                    return;
                }

                setProduct(productData);
                setVariants(variantData || []);
                const firstImage = productData?.images?.[0] || 'https://via.placeholder.com/640x800?text=No+Image';
                setSelectedImage(firstImage);
                setSelectedColor(variantData?.[0]?.color || null);
                setSelectedSize(variantData?.[0]?.size || null);
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Không thể tải chi tiết sản phẩm');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadDetail();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const colors = useMemo(
        () => [...new Set(variants.map((item) => item.color).filter(Boolean))],
        [variants]
    );

    const sizes = useMemo(() => {
        const filtered = selectedColor ? variants.filter((item) => item.color === selectedColor) : variants;
        return [...new Set(filtered.map((item) => item.size).filter(Boolean))];
    }, [variants, selectedColor]);

    const currentVariant = useMemo(() => {
        return (
            variants.find((item) => item.color === selectedColor && item.size === selectedSize) ||
            variants.find((item) => item.color === selectedColor) ||
            variants[0] ||
            null
        );
    }, [variants, selectedColor, selectedSize]);

    const handleQuantityChange = (delta) => {
        const maxStock = currentVariant?.stock || 999;
        setQuantity(prev => Math.min(maxStock, Math.max(1, prev + delta)));
    };

    const handleAddToCart = async () => {
        if (!currentVariant?.id) {
            alert('San pham nay chua co bien the de them vao gio');
            return false;
        }

        try {
            setAddingToCart(true);
            const userId = Number(localStorage.getItem('user_id') || 1);
            await addToCart({
                userId,
                productVariantId: currentVariant.id,
                quantity,
            });
            alert('Da them vao gio hang');
            return true;
        } catch (err) {
            alert(err.message || 'Them vao gio hang that bai');
            return false;
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        const added = await handleAddToCart();
        if (added) {
            window.location.href = '/cart';
        }
    };

    if (loading) return (
        <Layout>
            <div style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Đang tải...
            </div>
        </Layout>
    );

    if (error || !product) return (
        <Layout>
            <div style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {error || 'Không tìm thấy sản phẩm'}
            </div>
        </Layout>
    );

    const currentPrice = Number(currentVariant?.price ?? product.basePrice ?? 0);

    return (
        <Layout>
            <div className="product-detail-page">
                <div className="pd-container">
                    {/* Breadcrumbs */}
                    <div className="pd-breadcrumbs">
                        <Link to="/">Trang chủ</Link>
                        <span>/</span>
                        <Link to="/products">Sản phẩm</Link>
                        <span>/</span>
                        <span style={{ color: '#333' }}>{product.name}</span>
                    </div>

                    <div className="pd-layout">
                        {/* Left: Gallery */}
                        <div className="pd-gallery">
                            <div className="pd-thumbnails">
                                {(product.images?.length ? product.images : ['https://via.placeholder.com/640x800?text=No+Image']).map((img, idx) => (
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
                                <img src={selectedImage} alt={product.name} />
                            </div>
                        </div>

                        {/* Right: Info */}
                        <div className="pd-info">
                            <h1 className="pd-title">{product.name}</h1>
                            <div className="pd-meta">
                                <span>Mã: <b>{currentVariant?.sku || product.slug}</b></span>
                                <span>Tình trạng: <b>{(currentVariant?.stock || 0) > 0 ? 'Còn hàng' : 'Hết hàng'}</b></span>
                                <span>Thương hiệu: <b>5S Fashion</b></span>
                            </div>

                            <div className="pd-price-box">
                                <span className="pd-current-price">{formatCurrency(currentPrice)}đ</span>
                            </div>

                            {/* Options */}
                            <div className="pd-option-group">
                                <label className="pd-option-label">MÀU SẮC: {selectedColor || 'Đang cập nhật'}</label>
                                <div className="pd-colors">
                                    {colors.map((color) => (
                                        <div
                                            key={color}
                                            className={`pd-color-item ${selectedColor === color ? 'active' : ''}`}
                                            style={{ backgroundColor: '#444' }}
                                            onClick={() => setSelectedColor(color)}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="pd-option-group">
                                <label className="pd-option-label">KÍCH CỠ: {selectedSize || 'Đang cập nhật'}</label>
                                <div className="pd-sizes">
                                    {sizes.map((size) => (
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
                                <button className="pd-btn pd-btn-cart" onClick={handleAddToCart} disabled={addingToCart}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-7-4h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-.7-2H5.5M4 4h2.5l3.5 10h8.5" /></svg>
                                    {addingToCart ? 'DANG THEM...' : 'THÊM VÀO GIỎ'}
                                </button>
                                <button className="pd-btn pd-btn-buy" onClick={handleBuyNow} disabled={addingToCart}>
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
