import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import ProductCard from '../../components/ProductCard/ProductCard';
import {
  getCategoryBySlug,
  getProducts,
  getProductsByCategory,
  toProductCardModel,
} from '../../services/catalogApi';
import './CategoryPage.css';

import bannerMen from '../../assets/Herobanner1.jpg';
import bannerWomen from '../../assets/Herobanner2.jpg';
import bannerKids from '../../assets/Herobanner3.jpg';

const CATEGORY_CONFIG = {
  nam: { title: 'THOI TRANG NAM', banner: bannerMen },
  nu: { title: 'THOI TRANG NU', banner: bannerWomen },
  'be-trai': { title: 'THOI TRANG BE TRAI', banner: bannerKids },
  'be-gai': { title: 'THOI TRANG BE GAI', banner: bannerWomen },
  default: { title: 'SAN PHAM', banner: bannerMen },
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState(CATEGORY_CONFIG.default.title);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const config = useMemo(() => CATEGORY_CONFIG[slug] || CATEGORY_CONFIG.default, [slug]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        window.scrollTo(0, 0);

        if (slug === 'all') {
          const page = await getProducts({ page: 0, size: 40 });
          if (!isMounted) {
            return;
          }
          setCategoryName('TAT CA SAN PHAM');
          setProducts(page?.content || []);
          return;
        }

        const category = await getCategoryBySlug(slug);
        if (!isMounted) {
          return;
        }
        setCategoryName(category?.name || config.title);

        const page = await getProductsByCategory(category.id, { page: 0, size: 40 });
        if (isMounted) {
          setProducts(page?.content || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Khong the tai du lieu danh muc');
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug, config.title]);

  const cardProducts = useMemo(
    () => products.map((product) => toProductCardModel(product, categoryName)),
    [products, categoryName]
  );

  return (
    <Layout>
      <div className="category-page">
        <div className="category-hero" style={{ backgroundImage: `url(${config.banner})` }}>
          <h1>{categoryName}</h1>
        </div>

        <div className="container">
          <div className="cat-layout">
            <aside className="cat-sidebar">
              <div className="sidebar-title">BO LOC TIM KIEM</div>

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
                <div className="filter-header">MAU SAC</div>
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
                <div className="filter-header">GIA</div>
                <div className="filter-items">
                  <label className="custom-checkbox"><input type="checkbox" /> Duoi 200k</label>
                  <label className="custom-checkbox"><input type="checkbox" /> 200k - 500k</label>
                  <label className="custom-checkbox"><input type="checkbox" /> Tren 500k</label>
                </div>
              </div>
            </aside>

            <main className="cat-content">
              <div className="cat-toolbar">
                <span>Hien thi <b>{cardProducts.length}</b> san pham</span>
                <div className="sort-wrapper">
                  <span>Sap xep:</span>
                  <select>
                    <option>Moi nhat</option>
                    <option>Ban chay</option>
                    <option>Gia thap den cao</option>
                    <option>Gia cao den thap</option>
                  </select>
                </div>
              </div>

              {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Dang tai san pham...</div>}

              {!loading && error && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && cardProducts.length > 0 && (
                <div className="product-grid">
                  {cardProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {!loading && !error && cardProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>Dang cap nhat san pham cho danh muc nay...</p>
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
