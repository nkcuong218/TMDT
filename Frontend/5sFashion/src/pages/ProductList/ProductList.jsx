import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductList.css';

// Import Banners
import bannerMen from '../../assets/Herobanner1.jpg';
import bannerWomen from '../../assets/Herobanner2.jpg';
import bannerKids from '../../assets/Herobanner3.jpg';

// Import mocks
import p1 from '../../assets/product1.jpg';
import p2 from '../../assets/product2.jpg';
import p3 from '../../assets/product3.png';
import p4 from '../../assets/product4.png';
import p5 from '../../assets/product5.png';
import p6 from '../../assets/product6.png';
import p7 from '../../assets/product7.png';
import p8 from '../../assets/product8.png';

const MOCK_PRODUCTS = [
    { id: 1, title: 'Áo Khoác Gió Nam Pro-DWR 5S', price: 499000, originalPrice: 650000, discount: 23, image: p1, category: 'nam' },
    { id: 2, title: 'Áo Giữ Nhiệt Nam Heattech', price: 199000, originalPrice: 250000, discount: 20, image: p2, category: 'nam' },
    { id: 3, title: 'Bộ Nỉ Nam 5S Fashion Sport', price: 699000, originalPrice: 850000, discount: 17, image: p3, category: 'nam' },
    { id: 4, title: 'Áo Len Nữ Cardigan', price: 359000, originalPrice: 450000, discount: 20, image: p4, category: 'nu' },
    { id: 5, title: 'Quần Tây Nam Basic Slimfit', price: 399000, originalPrice: 500000, discount: 20, image: p5, category: 'nam' },
    { id: 6, title: 'Áo Sơ Mi Nam Kẻ Signature', price: 329000, originalPrice: 400000, discount: 18, image: p6, category: 'nam' },
    { id: 7, title: 'Quần Kaki Dài Nam Cotton', price: 429000, originalPrice: 550000, discount: 22, image: p7, category: 'nam' },
    { id: 8, title: 'Áo Polo Nam Can Phối Trẻ Trung', price: 299000, originalPrice: 350000, discount: 15, image: p8, category: 'nam' },
];

const ProductList = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredProducts = selectedCategory === 'all'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <Layout>
            <div className="catalog-page">
                {/* 1. Hero Section - General Vibe */}
                <div className="catalog-hero">
                    <div className="catalog-hero-text">
                        <h1>KHÁM PHÁ PHONG CÁCH MỚI</h1>
                        <p>Bộ sưu tập thời trang 2025. Nâng tầm diện mạo của bạn.</p>
                    </div>
                </div>

                <div className="container">
                    {/* 2. Category Selection Grid (General Selection) */}
                    <div className="category-grid">
                        <div className="category-card" onClick={() => setSelectedCategory('nam')}>
                            <div className="cat-img" style={{ backgroundImage: `url(${bannerMen})` }}></div>
                            <div className="cat-overlay">
                                <h3>THỜI TRANG NAM</h3>
                                <span>Xem ngay</span>
                            </div>
                        </div>
                        <div className="category-card" onClick={() => setSelectedCategory('nu')}>
                            <div className="cat-img" style={{ backgroundImage: `url(${bannerWomen})` }}></div>
                            <div className="cat-overlay">
                                <h3>THỜI TRANG NỮ</h3>
                                <span>Xem ngay</span>
                            </div>
                        </div>
                        <div className="category-card" onClick={() => setSelectedCategory('kids')}>
                            <div className="cat-img" style={{ backgroundImage: `url(${bannerKids})` }}></div>
                            <div className="cat-overlay">
                                <h3>TRẺ EM</h3>
                                <span>Xem ngay</span>
                            </div>
                        </div>
                        <div className="category-card" onClick={() => setSelectedCategory('all')}>
                            <div className="cat-img" style={{ backgroundColor: '#333' }}>
                                {/* Just a dark card for 'All' or Collection */}
                                <span style={{ color: 'white', fontSize: '40px', fontWeight: 'bold' }}>SALE</span>
                            </div>
                            <div className="cat-overlay">
                                <h3>KHUYẾN MÃI</h3>
                                <span>Xem ngay</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Product Display Area */}
                    <div className="catalog-products-section">
                        <div className="section-header">
                            <h2>{selectedCategory === 'all' ? 'GỢI Ý CHO BẠN' :
                                selectedCategory === 'nam' ? 'THỜI TRANG NAM' :
                                    selectedCategory === 'nu' ? 'THỜI TRANG NỮ' : 'TRẺ EM'}</h2>

                            <div className="sort-filter-bar">
                                <button className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>Tất cả</button>
                                <button className={`filter-chip ${selectedCategory === 'nam' ? 'active' : ''}`} onClick={() => setSelectedCategory('nam')}>Nam</button>
                                <button className={`filter-chip ${selectedCategory === 'nu' ? 'active' : ''}`} onClick={() => setSelectedCategory('nu')}>Nữ</button>
                                <button className={`filter-chip ${selectedCategory === 'kids' ? 'active' : ''}`} onClick={() => setSelectedCategory('kids')}>Trẻ em</button>
                            </div>
                        </div>

                        <div className="plp-products">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductList;
