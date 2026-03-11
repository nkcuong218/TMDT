import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { getAdminOrders } from '../../../services/catalogApi';

const OrderManager = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getAdminOrders({ status: filterStatus });
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'Khong the tai danh sach don hang');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [filterStatus]);

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
                        {loading && (
                            <tr>
                                <td colSpan="7">Dang tai du lieu...</td>
                            </tr>
                        )}
                        {!loading && error && (
                            <tr>
                                <td colSpan="7" style={{ color: 'red' }}>{error}</td>
                            </tr>
                        )}
                        {!loading && !error && orders.length === 0 && (
                            <tr>
                                <td colSpan="7">Khong co don hang nao</td>
                            </tr>
                        )}
                        {!loading && !error && orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.code}</td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{order.customer}</div>
                                </td>
                                <td>{order.phone}</td>
                                <td>{order.date}</td>
                                <td>{Number(order.total || 0).toLocaleString()}đ</td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate(`/admin/orders/${order.id}`)}
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
