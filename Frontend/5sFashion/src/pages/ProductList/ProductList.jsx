import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getCategories, getProducts, getProductsByCategory, toProductCardModel } from '../../services/catalogApi';
import './ProductList.css';

// Import Banners
import bannerMen from '../../assets/Herobanner1.jpg';
import bannerWomen from '../../assets/Herobanner2.jpg';
import bannerKids from '../../assets/Herobanner3.jpg';

const ProductList = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            try {
                setLoading(true);
                setError('');
                const [categoryData, productPage] = await Promise.all([
                    getCategories(),
                    getProducts({ page: 0, size: 40 }),
                ]);

                if (!isMounted) {
                    return;
                }

                setCategories(categoryData || []);
                setProducts(productPage?.content || []);
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Không thể tải sản phẩm');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadInitialData();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadByCategory = async () => {
            try {
                setLoading(true);
                setError('');

                if (selectedCategory === 'all') {
                    const page = await getProducts({ page: 0, size: 40 });
                    if (isMounted) {
                        setProducts(page?.content || []);
                    }
                    return;
                }

                const category = categories.find((item) => item.slug === selectedCategory);
                if (!category) {
                    setProducts([]);
                    return;
                }

                const page = await getProductsByCategory(category.id, { page: 0, size: 40 });
                if (isMounted) {
                    setProducts(page?.content || []);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Không thể lọc sản phẩm theo danh mục');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadByCategory();
        return () => {
            isMounted = false;
        };
    }, [selectedCategory, categories]);

    const filteredProducts = useMemo(() => {
        const categoryName = selectedCategory === 'all'
            ? 'Sản phẩm'
            : (categories.find((item) => item.slug === selectedCategory)?.name || 'Sản phẩm');

        return products.map((item) => toProductCardModel(item, categoryName));
    }, [products, categories, selectedCategory]);

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
                                <button className={`filter-chip ${selectedCategory === 'be-trai' ? 'active' : ''}`} onClick={() => setSelectedCategory('be-trai')}>Trẻ em</button>
                            </div>
                        </div>

                        <div className="plp-products">
                            {loading && <p>Đang tải sản phẩm...</p>}
                            {!loading && error && <p>{error}</p>}
                            {!loading && !error && filteredProducts.map(product => (
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
