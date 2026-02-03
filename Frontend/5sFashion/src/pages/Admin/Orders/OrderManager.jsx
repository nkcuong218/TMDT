import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';

const OrderManager = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState('All');

    // Mock Orders
    const [orders, setOrders] = useState([
        { id: '#ORD-001', customer: 'Nguyễn Văn A', phone: '0901234567', date: '03/02/2026', total: 499000, status: 'Pending' },
        { id: '#ORD-002', customer: 'Trần Thị B', phone: '0987654321', date: '03/02/2026', total: 1250000, status: 'Completed' },
        { id: '#ORD-003', customer: 'Lê Văn C', phone: '0912345678', date: '02/02/2026', total: 299000, status: 'Cancelled' },
        { id: '#ORD-004', customer: 'Phạm Thị D', phone: '0998877665', date: '02/02/2026', total: 850000, status: 'Processing' },
        { id: '#ORD-005', customer: 'Hoàng Văn E', phone: '0933445566', date: '01/02/2026', total: 150000, status: 'Shipping' },
    ]);

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

    const filteredOrders = filterStatus === 'All'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    return (
        <AdminLayout title="Quản Lý Đơn Hàng">
            <div className="admin-card">

                {/* Filters */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    {['All', 'Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: filterStatus === status ? '#ef4444' : 'transparent',
                                color: filterStatus === status ? 'white' : '#555',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {status === 'All' ? 'Tất cả' : status}
                        </button>
                    ))}
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã Đơn</th>
                            <th>Khách Hàng</th>
                            <th>SĐT</th>
                            <th>Ngày Đặt</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{order.customer}</div>
                                </td>
                                <td>{order.phone}</td>
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
        </AdminLayout>
    );
};

export default OrderManager;
