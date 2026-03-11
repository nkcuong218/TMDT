import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { getWarehouseHistory } from '../../../services/catalogApi';

const WarehouseHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadHistory = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getWarehouseHistory(id);
                if (!isMounted) {
                    return;
                }
                setProduct(response?.product || null);
                setHistory(response?.history || []);
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Khong the tai lich su kho');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadHistory();

        return () => {
            isMounted = false;
        };

    }, [id]);

    const handleViewInvoice = (item) => {
        if (!item.importId) {
            return;
        }
        navigate(`/admin/warehouse/invoice/${item.importId}`);
    };

    if (loading) {
        return <AdminLayout>Dang tai...</AdminLayout>;
    }

    if (error) {
        return <AdminLayout>{error}</AdminLayout>;
    }

    if (!product) {
        return <AdminLayout>Loading...</AdminLayout>;
    }

    return (
        <AdminLayout title="Lịch Sử Kho Hàng">
            <div className="admin-card">
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '5px' }}>{product.name}</h2>
                        <div style={{ color: '#666' }}>
                            <span style={{ marginRight: '15px' }}>SKU: <strong>{product.sku}</strong></span>
                            <span style={{ marginRight: '15px' }}>Biến thể: <strong>{product.color} - {product.size}</strong></span>
                            <span>Tồn hiện tại: <strong style={{ color: '#DA251D' }}>{product.currentStock}</strong></span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/warehouse')}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #ddd',
                            background: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Quay Lại
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Thời Gian</th>
                                <th>Loại Giao Dịch</th>
                                <th>Thay Đổi</th>
                                <th>Tồn Cuối</th>
                                <th>Ghi Chú</th>
                                <th>Người Thực Hiện</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(item => (
                                <tr key={item.id}>
                                    <td>{item.date}</td>
                                    <td>
                                        <span
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                backgroundColor: item.type === 'Nhập' ? '#E3F2FD' : item.type === 'Xuất' ? '#FCE4EC' : '#FFF3E0',
                                                color: item.type === 'Nhập' ? '#1976D2' : item.type === 'Xuất' ? '#C2185B' : '#F57C00'
                                            }}
                                        >
                                            {item.type}
                                        </span>
                                    </td>
                                    <td style={{
                                        fontWeight: '600',
                                        color: item.quantity > 0 ? '#2E7D32' : '#C62828'
                                    }}>
                                        {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                                    </td>
                                    <td style={{ fontWeight: '600' }}>{item.remaining}</td>
                                    <td>{item.note}</td>
                                    <td>{item.user}</td>
                                    <td>
                                        {item.type === 'Nhập' && item.importId && (
                                            <button
                                                onClick={() => handleViewInvoice(item)}
                                                style={{
                                                    padding: '4px 8px',
                                                    fontSize: '12px',
                                                    color: '#1976D2',
                                                    background: 'transparent',
                                                    border: '1px solid #1976D2',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Xem Hóa Đơn
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};
export default WarehouseHistory;
