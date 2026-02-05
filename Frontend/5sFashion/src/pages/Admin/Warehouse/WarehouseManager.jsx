import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';

const WarehouseManager = () => {
    // Mock warehouse data
    const [warehouseItems, setWarehouseItems] = useState([
        { id: 1, name: 'Áo Khoác Gió Nam Pro-DWR 5S', sku: 'AKG123', size: 'L', color: 'Đen', quantity: 50, location: 'Kho A - Kệ 1' },
        { id: 2, name: 'Quần Short Kaki Nam 5S', sku: 'QSK456', size: '32', color: 'Be', quantity: 120, location: 'Kho B - Kệ 3' },
        { id: 3, name: 'Váy Len Nữ', sku: 'VLN789', size: 'M', color: 'Đỏ', quantity: 30, location: 'Kho A - Kệ 2' },
        { id: 4, name: 'Áo Thun Basic', sku: 'ATB001', size: 'XL', color: 'Trắng', quantity: 200, location: 'Kho C - Kệ 1' },
    ]);

    return (
        <AdminLayout title="Quản Lý Kho Hàng">
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Tìm SKU hoặc tên SP..." className="form-input" style={{ width: 300, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <select style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option value="">Tất cả kho</option>
                            <option value="Kho A">Kho A</option>
                            <option value="Kho B">Kho B</option>
                            <option value="Kho C">Kho C</option>
                        </select>
                    </div>
                    <Link to="/admin/warehouse/import" className="btn-primary" style={{ height: 40, padding: '0 20px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>+ Nhập Kho</Link>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Sản Phẩm</th>
                            <th>Biến Thể</th>
                            <th>Vị Trí</th>
                            <th>Số Lượng</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouseItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>SKU: {item.sku}</div>
                                </td>
                                <td>{item.color} - {item.size}</td>
                                <td>{item.location}</td>
                                <td style={{ fontWeight: 600 }}>{item.quantity}</td>
                                <td>
                                    {item.quantity < 20 ? (
                                        <span className="status-badge status-danger">Sắp hết</span>
                                    ) : (
                                        <span className="status-badge status-success">Sẵn hàng</span>
                                    )}
                                </td>
                                <td>
                                    <Link to={`/admin/warehouse/history/${item.id}`} className="action-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Lịch Sử</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default WarehouseManager;
