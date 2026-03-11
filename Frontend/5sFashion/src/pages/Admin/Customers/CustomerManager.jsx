import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { getAdminCustomers, toggleAdminCustomerStatus } from '../../../services/catalogApi';

const CustomerManager = () => {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCustomers = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getAdminCustomers({ keyword });
                setCustomers(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'Khong the tai danh sach khach hang');
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(loadCustomers, 250);
        return () => clearTimeout(timer);
    }, [keyword]);

    const handleToggleStatus = async (id) => {
        const customer = customers.find(c => c.id === id);
        const newStatus = customer.status === 'Active' ? 'Blocked' : 'Active';
        const action = newStatus === 'Blocked' ? 'Khoa' : 'Mo khoa';

        if (window.confirm(`Ban co chac muon ${action} khach hang ${customer.name}?`)) {
            try {
                const updated = await toggleAdminCustomerStatus(id);
                setCustomers(customers.map(c =>
                    c.id === id ? { ...c, status: updated.status } : c
                ));
            } catch (err) {
                window.alert(err.message || 'Cap nhat trang thai that bai');
            }
        }
    };

    return (
        <AdminLayout title="Quản Lý Khách Hàng">
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Tim kiem khach hang..."
                            className="form-input"
                            style={{ width: 300 }}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>

                {error ? <div style={{ color: '#dc2626', marginBottom: '12px' }}>{error}</div> : null}
                {loading ? <div>Dang tai du lieu...</div> : null}

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
                                        <button className="action-btn" style={{ color: 'red' }} onClick={() => handleToggleStatus(c.id)}>Khoa</button>
                                    ) : (
                                        <button className="action-btn" style={{ color: 'green' }} onClick={() => handleToggleStatus(c.id)}>Mo</button>
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
