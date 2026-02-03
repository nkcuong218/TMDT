import React from 'react';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';

const ProductManager = () => {
    // Mock Products
    const products = [
        { id: 1, name: 'Áo Khoác Gió Nam Pro-DWR 5S', sku: 'AKG123', category: 'Nam', price: '499.000đ', stock: 50 },
        { id: 2, name: 'Quần Short Kaki Nam 5S', sku: 'QSK456', category: 'Nam', price: '299.000đ', stock: 120 },
        { id: 3, name: 'Váy Len Nữ', sku: 'VLN789', category: 'Nữ', price: '550.000đ', stock: 30 },
    ];

    return (
        <AdminLayout title="Quản Lý Sản Phẩm">
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Tìm kiếm sản phẩm..." className="form-input" style={{ width: 300 }} />
                    </div>
                    <button className="btn-primary" style={{ height: 42 }}>+ Thêm Sản Phẩm</button>
                </div>

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
                        {products.map(p => (
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
                                    <button className="action-btn" style={{ color: 'red' }}>Xóa</button>
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
