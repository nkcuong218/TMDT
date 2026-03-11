import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { getWarehouseItems } from '../../../services/catalogApi';

const WarehouseManager = () => {
    const [warehouseItems, setWarehouseItems] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [locationCode, setLocationCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadItems = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getWarehouseItems({ keyword: keyword.trim(), locationCode });
            setWarehouseItems(data || []);
        } catch (err) {
            setError(err.message || 'Khong the tai du lieu kho');
            setWarehouseItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();
        await loadItems();
    };

    return (
        <AdminLayout title="Quản Lý Kho Hàng">
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Tìm SKU hoặc tên SP..."
                            className="form-input"
                            style={{ width: 300, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <select
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            value={locationCode}
                            onChange={(e) => setLocationCode(e.target.value)}
                        >
                            <option value="">Tất cả kho</option>
                            <option value="A1">Kho A - Kệ 1</option>
                            <option value="A2">Kho A - Kệ 2</option>
                            <option value="B3">Kho B - Kệ 3</option>
                            <option value="C1">Kho C - Kệ 1</option>
                        </select>
                        <button type="submit" className="btn-primary" style={{ height: 40 }}>Lọc</button>
                    </form>
                    <Link to="/admin/warehouse/import" className="btn-primary" style={{ height: 40, padding: '0 20px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>+ Nhập Kho</Link>
                </div>

                {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
                {loading && <p style={{ marginBottom: 12 }}>Dang tai du lieu kho...</p>}

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
                        {!loading && warehouseItems.map(item => (
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
