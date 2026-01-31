import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import ProductCard from '../../components/ProductCard/ProductCard';
import './CategoryPage.css';

// Import Banners
import bannerMen from '../../assets/Herobanner1.jpg';
import bannerWomen from '../../assets/Herobanner2.jpg';
import bannerKids from '../../assets/Herobanner3.jpg';

// Import mocks to reuse
import p1 from '../../assets/product1.jpg';
import p2 from '../../assets/product2.jpg';
import p3 from '../../assets/product3.png';
import p4 from '../../assets/product4.png';
import p5 from '../../assets/product5.png';
import p6 from '../../assets/product6.png';
import p7 from '../../assets/product7.png';
import p8 from '../../assets/product8.png';

const ALL_PRODUCTS = [
    { id: 1, title: 'Áo Khoác Gió Nam Pro-DWR 5S', price: 499000, originalPrice: 650000, discount: 23, image: p1, category: 'nam', type: 'ao' },
    { id: 2, title: 'Áo Giữ Nhiệt Nam Heattech', price: 199000, originalPrice: 250000, discount: 20, image: p2, category: 'nam', type: 'ao' },
    { id: 3, title: 'Bộ Nỉ Nam 5S Fashion Sport', price: 699000, originalPrice: 850000, discount: 17, image: p3, category: 'nam', type: 'bo' },
    { id: 4, title: 'Áo Len Nữ Cardigan', price: 359000, originalPrice: 450000, discount: 20, image: p4, category: 'nu', type: 'ao' },
    { id: 5, title: 'Quần Tây Nam Basic Slimfit', price: 399000, originalPrice: 500000, discount: 20, image: p5, category: 'nam', type: 'quan' },
    { id: 6, title: 'Áo Sơ Mi Nam Kẻ Signature', price: 329000, originalPrice: 400000, discount: 18, image: p6, category: 'nam', type: 'ao' },
    { id: 7, title: 'Quần Kaki Dài Nam Cotton', price: 429000, originalPrice: 550000, discount: 22, image: p7, category: 'nam', type: 'quan' },
    { id: 8, title: 'Áo Polo Nam Can Phối Trẻ Trung', price: 299000, originalPrice: 350000, discount: 15, image: p8, category: 'nam', type: 'ao' },
    { id: 9, title: 'Váy Nữ Mùa Hè', price: 450000, originalPrice: 550000, discount: 18, image: p6, category: 'nu', type: 'vay' },
    { id: 10, title: 'Áo Thun Bé Trai', price: 150000, originalPrice: 200000, discount: 25, image: p3, category: 'be-trai', type: 'ao' },
    { id: 11, title: 'Quần Jeans Bé Trai', price: 250000, originalPrice: 300000, discount: 16, image: p5, category: 'be-trai', type: 'quan' },
    { id: 12, title: 'Váy Bé Gái Công Chúa', price: 350000, originalPrice: 450000, discount: 22, image: p4, category: 'be-gai', type: 'vay' },
];

const CATEGORY_CONFIG = {
    'nam': { title: 'THỜI TRANG NAM', banner: bannerMen },
    'nu': { title: 'THỜI TRANG NỮ', banner: bannerWomen },
    'be-trai': { title: 'THỜI TRANG BÉ TRAI', banner: bannerKids },
    'be-gai': { title: 'THỜI TRANG BÉ GÁI', banner: bannerWomen },
    'default': { title: 'SẢN PHẨM', banner: bannerMen }
};

const CategoryPage = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [config, setConfig] = useState(CATEGORY_CONFIG['default']);

    useEffect(() => {
        // Scroll to top
        window.scrollTo(0, 0);

        // Determine Config
        const currentConfig = CATEGORY_CONFIG[slug] || CATEGORY_CONFIG['default'];
        setConfig(currentConfig);

        // Filter Data (Mocking API Call)
        // In a real app, you would fetch `/api/products?category=${slug}`
        let filtered = ALL_PRODUCTS.filter(p => p.category === slug);

        // If empty (e.g. general category), show some random ones or all
        if (filtered.length === 0 && slug === 'all') {
            filtered = ALL_PRODUCTS;
        }

        setProducts(filtered);

    }, [slug]);

    return (
        <Layout>
            <div className="category-page">
                {/* Dynamic Hero */}
                <div className="category-hero" style={{ backgroundImage: `url(${config.banner})` }}>
                    <h1>{config.title}</h1>
                </div>

                <div className="container">
                    <div className="cat-layout">
                        {/* Sidebar Filters */}
                        <aside className="cat-sidebar">
                            <div className="sidebar-title">BỘ LỌC TÌM KIẾM</div>



                            <div className="filter-section">
                                <div className="filter-header">SIZE</div>
                                <div className="size-grid">
                                    <div className="size-item">S</div>
                                    <div className="size-item">M</div>
                                    <div className="size-item">L</div>
                                    <div className="size-item">XL</div>
                                    <div className="size-item">2XL</div>
                                </div>
                            </div>

                            <div className="filter-section">
                                <div className="filter-header">MÀU SẮC</div>
                                <div className="color-list">
                                    <div className="color-item" style={{ background: 'black' }}></div>
                                    <div className="color-item" style={{ background: 'white' }}></div>
                                    <div className="color-item" style={{ background: 'navy' }}></div>
                                    <div className="color-item" style={{ background: 'grey' }}></div>
                                    <div className="color-item" style={{ background: 'red' }}></div>
                                    <div className="color-item" style={{ background: 'beige' }}></div>
                                </div>
                            </div>
                            <div className="filter-section">
                                <div className="filter-header">GIÁ</div>
                                <div className="filter-items">
                                    <label className="custom-checkbox"><input type="checkbox" /> Dưới 200k</label>
                                    <label className="custom-checkbox"><input type="checkbox" /> 200k - 500k</label>
                                    <label className="custom-checkbox"><input type="checkbox" /> Trên 500k</label>
                                </div>
                            </div>
                        </aside>

                        {/* Main Product Grid */}
                        <main className="cat-content">
                            <div className="cat-toolbar">
                                <span>Hiển thị <b>{products.length}</b> sản phẩm</span>
                                <div className="sort-wrapper">
                                    <span>Sắp xếp:</span>
                                    <select>
                                        <option>Mới nhất</option>
                                        <option>Bán chạy</option>
                                        <option>Giá thấp đến cao</option>
                                        <option>Giá cao đến thấp</option>
                                    </select>
                                </div>
                            </div>

                            {products.length > 0 ? (
                                <div className="product-grid">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    <p>Đang cập nhật sản phẩm cho danh mục này...</p>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CategoryPage;
