import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { deleteProduct, formatCurrency, getCategories, getProducts, searchProducts } from '../../../services/catalogApi';

const ProductManager = () => {
    const [keyword, setKeyword] = useState('');
    const [products, setProducts] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadData = async (searchValue = '') => {
        try {
            setLoading(true);
            setError('');

            const [categoryData, productPage] = await Promise.all([
                getCategories(),
                searchValue ? searchProducts(searchValue, { page: 0, size: 50 }) : getProducts({ page: 0, size: 50 }),
            ]);

            const map = (categoryData || []).reduce((acc, item) => {
                acc[item.id] = item.name;
                return acc;
            }, {});

            setCategoryMap(map);
            setProducts(productPage?.content || []);
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách sản phẩm');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData('');
    }, []);

    const rows = useMemo(() => {
        return products.map((item) => ({
            id: item.id,
            name: item.name,
            sku: item.slug,
            category: categoryMap[item.categoryId] || '-',
            price: `${formatCurrency(item.basePrice)}đ`,
            stock: '-',
        }));
    }, [products, categoryMap]);

    const onSearch = async (event) => {
        event.preventDefault();
        await loadData(keyword.trim());
    };

    const onDelete = async (id) => {
        const confirmed = window.confirm('Bạn có chắc muốn xóa sản phẩm này?');
        if (!confirmed) {
            return;
        }

        try {
            await deleteProduct(id);
            await loadData(keyword.trim());
        } catch (err) {
            setError(err.message || 'Xóa sản phẩm thất bại');
        }
    };

    return (
        <AdminLayout title="Quản Lý Sản Phẩm">
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <form onSubmit={onSearch} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="form-input"
                            style={{ width: 300 }}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit" className="btn-primary">Tìm</button>
                    </form>
                    <Link to="/admin/products/add" className="btn-primary" style={{ height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', textDecoration: 'none', borderRadius: '4px' }}>+ Thêm Sản Phẩm</Link>
                </div>

                {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
                {loading && <p style={{ marginBottom: 12 }}>Đang tải dữ liệu...</p>}

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Sản Phẩm</th>
                            <th>SKU</th>
                            <th>Danh Mục</th>
                            <th>Giá Bán</th>
                            <th>Tồn Kho</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && rows.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                                </td>
                                <td>{p.sku}</td>
                                <td>{p.category}</td>
                                <td>{p.price}</td>
                                <td>{p.stock}</td>
                                <td>
                                    <button className="action-btn">Sửa</button>
                                    <button className="action-btn" style={{ color: 'red' }} onClick={() => onDelete(p.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default ProductManager;
