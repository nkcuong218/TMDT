import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <div className="product-image">
                {product.discount > 0 && (
                    <div className="product-badge">-{product.discount}%</div>
                )}
                <img src={product.image} alt={product.title} loading="lazy" />
            </div>

            <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-title" title={product.title}>{product.title}</h3>

                <div className="product-price-wrapper">
                    <span className="current-price">{product.price.toLocaleString('vi-VN')}đ</span>
                    {product.originalPrice > product.price && (
                        <span className="original-price">{product.originalPrice.toLocaleString('vi-VN')}đ</span>
                    )}
                </div>

                <button className="add-to-cart-btn">
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
