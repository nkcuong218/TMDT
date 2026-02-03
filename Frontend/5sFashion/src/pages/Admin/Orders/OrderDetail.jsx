import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    // Mock Data Fetch Logic
    useEffect(() => {
        // Simulating API call
        const mockOrder = {
            id: id,
            customer: 'Nguyễn Văn A',
            phone: '0901234567',
            email: 'nguyenvana@gmail.com',
            date: '03/02/2026 14:30',
            total: 499000,
            status: 'Pending',
            paymentMethod: 'COD',
            shippingFee: 30000,
            address: '123 Cầu Giấy, Quận Cầu Giấy, Hà Nội',
            items: [
                { id: 1, name: 'Áo Khoác Gió Nam Pro-DWR 5S', sku: 'AKG123', size: 'L', color: 'Xanh Đen', quantity: 1, price: 469000 }
            ],
            history: [
                { date: '03/02/2026 14:30', action: 'Đơn hàng được tạo' },
                { date: '03/02/2026 14:35', action: 'Đã xác nhận thanh toán (COD)' }
            ]
        };
        setOrder(mockOrder);
    }, [id]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-success';
            case 'Pending': return 'status-warning';
            case 'Processing': return 'status-warning';
            case 'Shipping': return 'status-warning';
            case 'Cancelled': return 'status-danger';
            default: return '';
        }
    };

    const handleStatusUpdate = (newStatus) => {
        if (window.confirm(`Xác nhận cập nhật trạng thái sang ${newStatus}?`)) {
            setOrder({ ...order, status: newStatus });
            alert('Cập nhật thành công!');
        }
    };

    if (!order) return <AdminLayout>Loading...</AdminLayout>;

    return (
        <AdminLayout title={`Chi Tiết Đơn Hàng ${id}`}>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => navigate('/admin/orders')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    ← Quay lại danh sách
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Left Column: Order Items & Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Items Card */}
                    <div className="admin-card">
                        <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Sản Phẩm</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Sản Phẩm</th>
                                    <th>Đơn Giá</th>
                                    <th>SL</th>
                                    <th>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#333' }}>{item.name}</div>
                                            <div style={{ fontSize: '12px', color: '#777' }}>SKU: {item.sku} | {item.size} / {item.color}</div>
                                        </td>
                                        <td>{item.price.toLocaleString()}đ</td>
                                        <td>{item.quantity}</td>
                                        <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'right', paddingTop: '10px' }}>Tạm tính:</td>
                                    <td style={{ paddingTop: '10px' }}>{(order.total - order.shippingFee).toLocaleString()}đ</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'right' }}>Phí vận chuyển:</td>
                                    <td>{order.shippingFee.toLocaleString()}đ</td>
                                </tr>
                                <tr style={{ fontSize: '16px', fontWeight: 700, color: '#ef4444' }}>
                                    <td colSpan="3" style={{ textAlign: 'right' }}>Tổng cộng:</td>
                                    <td>{order.total.toLocaleString()}đ</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Timeline / History (Optional) */}
                    <div className="admin-card">
                        <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Lịch Sử Đơn Hàng</h3>
                        {order.history.map((h, i) => (
                            <div key={i} style={{ marginBottom: '10px', fontSize: '14px' }}>
                                <span style={{ color: '#888', marginRight: '10px' }}>{h.date}</span>
                                <span>{h.action}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Customer & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Main Actions */}
                    <div className="admin-card">
                        <h3 style={{ marginBottom: '15px' }}>Thao Tác</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 600, color: '#555' }}>Trạng Thái Đơn Hàng</label>
                            <select
                                className="form-input"
                                style={{ width: '100%', height: '40px' }}
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                            >
                                <option value="Pending">Chờ xác nhận (Pending)</option>
                                <option value="Processing">Đang xử lý (Processing)</option>
                                <option value="Shipping">Đang giao (Shipping)</option>
                                <option value="Completed">Hoàn thành (Completed)</option>
                                <option value="Cancelled">Đã hủy (Cancelled)</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-primary" style={{ flex: 1 }}>In Hóa Đơn</button>
                            <button className="btn-secondary" style={{ flex: 1 }}>Gửi Email</button>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="admin-card">
                        <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Thông Tin Khách Hàng</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <div style={{ width: 40, height: 40, background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                👤
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{order.customer}</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>Khách hàng thân thiết</div>
                            </div>
                        </div>

                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            <p>📧 <a href={`mailto:${order.email}`}>{order.email}</a></p>
                            <p>📞 {order.phone}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="admin-card">
                        <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Địa Chỉ Giao Hàng</h3>
                        <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
                            {order.address}
                        </p>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderDetail;
