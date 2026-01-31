import React from 'react';
import Layout from '../../components/Layout/Layout';
import Hero from '../../components/Hero/Hero';
import ProductSection from '../../components/ProductSection/ProductSection';
import PolicySection from '../../components/PolicySection/PolicySection';

// Import product images
import p1 from '../../assets/product1.jpg';
import p2 from '../../assets/product2.jpg';
import p3 from '../../assets/product3.png';
import p4 from '../../assets/product4.png';
import p5 from '../../assets/product5.png';
import p6 from '../../assets/product6.png';
import p7 from '../../assets/product7.png';
import p8 from '../../assets/product8.png';

// Mock Data
const newArrivals = [
    { id: 1, title: 'Áo Khoác Gió Nam Pro-DWR 5S FASHION Tay Raglan', price: 499000, originalPrice: 650000, discount: 23, image: p1, category: 'Áo Khoác' },
    { id: 2, title: 'Áo Giữ Nhiệt Nam Cổ 3 Phân 5S Fashion HEATTECH', price: 199000, originalPrice: 250000, discount: 20, image: p2, category: 'Áo Giữ Nhiệt' },
    { id: 3, title: 'Bộ Nỉ Nam 5S Fashion S-WARM Thêu Tinh Tế', price: 699000, originalPrice: 850000, discount: 17, image: p3, category: 'Bộ Đồ' },
    { id: 4, title: 'Áo Len Nữ Cardigan 5S Fashion Phom Regular', price: 359000, originalPrice: 450000, discount: 20, image: p4, category: 'Áo Len' },
];

const bestSellers = [
    { id: 5, title: 'Quần Tây Nam 5S Fashion Basic Phom Slimfit', price: 399000, originalPrice: 500000, discount: 20, image: p5, category: 'Quần Tây' },
    { id: 6, title: 'Áo Sơ Mi Nam 5S Fashion Họa Tiết Kẻ Phom Slimfit', price: 329000, originalPrice: 400000, discount: 18, image: p6, category: 'Áo Sơ Mi' },
    { id: 7, title: 'Quần Kaki Dài Nam 5S Fashion Cotton Phom Slimfit', price: 429000, originalPrice: 550000, discount: 22, image: p7, category: 'Quần Kaki' },
    { id: 8, title: 'Áo Polo Nam Can Phối In Chữ 5S Fashion Trẻ Trung', price: 299000, originalPrice: 350000, discount: 15, image: p8, category: 'Áo Polo' },
];

const Home = () => {
    return (
        <Layout>
            <Hero />
            <PolicySection />
            <ProductSection
                title="Hàng Mới Về"
                products={newArrivals}
            />

            <ProductSection
                title="Bán Chạy Nhất"
                products={bestSellers}
            />
        </Layout>
    );
};

export default Home;
