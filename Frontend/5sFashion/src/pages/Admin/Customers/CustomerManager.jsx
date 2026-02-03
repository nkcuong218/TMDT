import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';

const CustomerManager = () => {
    const navigate = useNavigate();

    // Mock Customers State
    const [customers, setCustomers] = useState([
        { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567', totalOrders: 5, totalSpent: 2500000, status: 'Active' },
        { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0987654321', totalOrders: 12, totalSpent: 15200000, status: 'Active' },
        { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0912345678', totalOrders: 1, totalSpent: 299000, status: 'Blocked' },
        { id: 4, name: 'Phạm Thị D', email: 'phamthid@gmail.com', phone: '0998877665', totalOrders: 3, totalSpent: 1200000, status: 'Active' },
    ]);

    const handleToggleStatus = (id) => {
        const customer = customers.find(c => c.id === id);
        const newStatus = customer.status === 'Active' ? 'Blocked' : 'Active';
        const action = newStatus === 'Blocked' ? 'Khóa' : 'Mở khóa';

        if (window.confirm(`Bạn có chắc muốn ${action} khách hàng ${customer.name}?`)) {
            setCustomers(customers.map(c =>
                c.id === id ? { ...c, status: newStatus } : c
            ));
        }
    };

    return (
        <AdminLayout title="Quản Lý Khách Hàng">
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Tìm kiếm khách hàng..." className="form-input" style={{ width: 300 }} />
                    </div>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ và Tên</th>
                            <th>Email</th>
                            <th>Số Điện Thoại</th>
                            <th>Đơn Hàng</th>
                            <th>Tổng Chi</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                                </td>
                                <td>{c.email}</td>
                                <td>{c.phone}</td>
                                <td>{c.totalOrders}</td>
                                <td>{c.totalSpent.toLocaleString()}đ</td>
                                <td>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '10px',
                                        fontSize: '12px',
                                        background: c.status === 'Active' ? '#d1fae5' : '#fee2e2',
                                        color: c.status === 'Active' ? '#065f46' : '#b91c1c'
                                    }}>
                                        {c.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate(`/admin/users/${c.id}`)}
                                    >
                                        Xem
                                    </button>
                                    {c.status === 'Active' ? (
                                        <button className="action-btn" style={{ color: 'red' }} onClick={() => handleToggleStatus(c.id)}>Khóa</button>
                                    ) : (
                                        <button className="action-btn" style={{ color: 'green' }} onClick={() => handleToggleStatus(c.id)}>Mở</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default CustomerManager;
