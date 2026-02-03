import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        // Mock API Call
        const mockCustomer = {
            id: id,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@gmail.com',
            phone: '0901234567',
            address: '123 Cầu Giấy, Hà Nội',
            joinDate: '20/01/2026',
            status: 'Active',
            stats: {
                totalOrders: 5,
                totalSpent: 2500000,
                lastOrderDate: '03/02/2026'
            },
            orders: [
                { id: '#ORD-001', date: '03/02/2026', total: 499000, status: 'Pending' },
                { id: '#ORD-012', date: '25/01/2026', total: 1200000, status: 'Completed' },
                { id: '#ORD-025', date: '10/01/2026', total: 800000, status: 'Completed' }
            ]
        };
        setCustomer(mockCustomer);
    }, [id]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-success';
            case 'Pending': return 'status-warning';
            case 'Processing': return 'status-warning';
            case 'Cancelled': return 'status-danger';
            default: return '';
        }
    };

    if (!customer) return <AdminLayout>Loading...</AdminLayout>;

    return (
        <AdminLayout title={`Chi Tiết Khách Hàng #${id}`}>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => navigate('/admin/users')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    ← Quay lại danh sách
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>

                {/* Left Column: Profile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="admin-card">
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ width: 80, height: 80, background: '#eee', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                                👤
                            </div>
                            <h3 style={{ marginBottom: '5px' }}>{customer.name}</h3>
                            <span style={{
                                padding: '4px 10px',
                                borderRadius: '10px',
                                fontSize: '12px',
                                background: customer.status === 'Active' ? '#d1fae5' : '#fee2e2',
                                color: customer.status === 'Active' ? '#065f46' : '#b91c1c'
                            }}>
                                {customer.status}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px' }}>
                            <div>
                                <label style={{ color: '#666', fontSize: '12px' }}>Email</label>
                                <div>{customer.email}</div>
                            </div>
                            <div>
                                <label style={{ color: '#666', fontSize: '12px' }}>Số Điện Thoại</label>
                                <div>{customer.phone}</div>
                            </div>
                            <div>
                                <label style={{ color: '#666', fontSize: '12px' }}>Địa Chỉ</label>
                                <div>{customer.address}</div>
                            </div>
                            <div>
                                <label style={{ color: '#666', fontSize: '12px' }}>Ngày Tham Gia</label>
                                <div>{customer.joinDate}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            {customer.status === 'Active' ?
                                <button className="btn-secondary" style={{ width: '100%', color: 'red', borderColor: 'red' }}>Khóa Tài Khoản</button> :
                                <button className="btn-secondary" style={{ width: '100%', color: 'green', borderColor: 'green' }}>Mở Khóa Tài Khoản</button>
                            }
                        </div>
                    </div>

                    <div className="admin-card">
                        <h4 style={{ marginBottom: '15px' }}>Thống Kê</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                                <div style={{ fontSize: '12px', color: '#666' }}>Tổng Đơn</div>
                                <div style={{ fontSize: '18px', fontWeight: 700 }}>{customer.stats.totalOrders}</div>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                                <div style={{ fontSize: '12px', color: '#666' }}>Tổng Chi Tiêu</div>
                                <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>{(customer.stats.totalSpent / 1000000).toFixed(1)}M</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order History */}
                <div className="admin-card">
                    <h3 style={{ marginBottom: '20px' }}>Lịch Sử Đơn Hàng</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mã Đơn</th>
                                <th>Ngày Đặt</th>
                                <th>Tổng Tiền</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customer.orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.total.toLocaleString()}đ</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => navigate(`/admin/orders/${order.id.replace('#', '')}`)}
                                        >
                                            Xem
                                        </button>
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

export default CustomerDetail;
