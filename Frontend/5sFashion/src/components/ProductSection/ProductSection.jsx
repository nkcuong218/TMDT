import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductSection.css';

const ProductSection = ({ title, products, link }) => {
    return (
        <section className="product-section">
            <div className="container">
                <h2 className="section-title">{title}</h2>

                <div className="grid-products">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <a href={link || "#"} className="view-all-btn">Xem Tất Cả</a>
            </div>
        </section>
    );
};

export default ProductSection;
