import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Hero from '../../components/Hero/Hero';
import ProductSection from '../../components/ProductSection/ProductSection';
import PolicySection from '../../components/PolicySection/PolicySection';
import { getProducts } from '../../services/catalogApi';

const Home = () => {
    const [newArrivals, setNewArrivals] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeProducts = async () => {
            try {
                setLoading(true);
                // Lấy 8 sản phẩm đầu tiên cho New Arrivals
                const response = await getProducts({ page: 0, size: 8 });
                const products = response?.content || [];
                
                // Transform backend data sang format của ProductCard
                const transformedProducts = products.map(p => ({
                    id: p.id,
                    title: p.name,
                    price: p.basePrice,
                    originalPrice: p.originalPrice,
                    discount: p.originalPrice ? Math.round(((p.originalPrice - p.basePrice) / p.originalPrice) * 100) : 0,
                    image: p.primaryImage || 'https://via.placeholder.com/300x400?text=No+Image',
                    category: p.categoryName || 'Sản phẩm'
                }));

                // Chia làm 2 phần: 4 sản phẩm mới, 4 sản phẩm bán chạy
                setNewArrivals(transformedProducts.slice(0, 4));
                setBestSellers(transformedProducts.slice(4, 8));
            } catch (error) {
                console.error('Error loading home products:', error);
                // Nếu lỗi, để mảng rỗng
                setNewArrivals([]);
                setBestSellers([]);
            } finally {
                setLoading(false);
            }
        };

        loadHomeProducts();
    }, []);

    if (loading) {
        return (
            <Layout>
                <Hero />
                <PolicySection />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    Đang tải sản phẩm...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Hero />
            <PolicySection />
            
            {newArrivals.length > 0 && (
                <ProductSection
                    title="Hàng Mới Về"
                    products={newArrivals}
                />
            )}

            {bestSellers.length > 0 && (
                <ProductSection
                    title="Bán Chạy Nhất"
                    products={bestSellers}
                />
            )}
        </Layout>
    );
};

export default Home;
