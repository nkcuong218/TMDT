import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';

const WarehouseHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Product Data (In real app, fetch by ID)
    const [product, setProduct] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Simulating API fetch
        const mockProduct = {
            id: id,
            name: 'Áo Khoác Gió Nam Pro-DWR 5S',
            sku: 'AKG123',
            size: 'L',
            color: 'Đen',
            currentStock: 50
        };
        setProduct(mockProduct);

        const mockHistory = [
            { id: 1, date: '2023-10-25 14:30', type: 'Nhập', quantity: 100, remaining: 100, note: 'Nhập hàng mới từ NCC', user: 'Admin' },
            { id: 2, date: '2023-10-26 09:15', type: 'Xuất', quantity: -2, remaining: 98, note: 'Đơn hàng #DH-001', user: 'System' },
            { id: 3, date: '2023-10-26 10:00', type: 'Xuất', quantity: -5, remaining: 93, note: 'Đơn hàng #DH-005', user: 'System' },
            { id: 4, date: '2023-10-27 16:20', type: 'Xuất', quantity: -10, remaining: 83, note: 'Xuất chuyển kho CN2', user: 'Kho' },
            { id: 5, date: '2023-10-28 08:00', type: 'Kiểm', quantity: -3, remaining: 80, note: 'Điều chỉnh sau kiểm kê', user: 'Admin' }, // Điều chỉnh giảm
            { id: 6, date: '2023-11-01 10:00', type: 'Nhập', quantity: 20, remaining: 100, note: 'Nhập bổ sung', user: 'Admin' },
            { id: 7, date: '2023-11-02 11:30', type: 'Xuất', quantity: -50, remaining: 50, note: 'Xuất bán sỉ', user: 'Sales' },
        ];
        // Sort newest first
        setHistory(mockHistory.sort((a, b) => new Date(b.date) - new Date(a.date)));

    }, [id]);

    const handleViewInvoice = (item) => {
        // Navigate to the invoice page using the item's ID or a specific invoice ID if available
        // For mock purposes, using the history item ID
        navigate(`/admin/warehouse/invoice/${item.id}`);
    };

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
                                        {item.type === 'Nhập' && (
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
