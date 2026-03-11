import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import './Account.css';
import { getMyOrders } from '../../services/catalogApi';

const Account = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userId = Number(localStorage.getItem('user_id') || 0);

    useEffect(() => {
        const loadOrders = async () => {
            if (!userId) {
                setError('Vui long dang nhap de xem don hang cua ban.');
                setLoading(false);
                return;
            }

            try {
                setError('');
                const data = await getMyOrders(userId);
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'Khong the tai lich su don hang.');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [userId]);

    return (
        <Layout>
            <div className="account-container">
                <div className="container">
                    <div className="account-content">
                        <h2 className="section-title">Don Hang Cua Toi</h2>

                        {loading && <p>Dang tai du lieu...</p>}
                        {!loading && error && <p style={{ color: 'red' }}>{error}</p>}

                        {!loading && !error && orders.length === 0 && (
                            <p>Ban chua co don hang nao.</p>
                        )}

                        {!loading && !error && orders.length > 0 && (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Ma Don</th>
                                        <th>Ngay Dat</th>
                                        <th>Tong Tien</th>
                                        <th>Trang Thai</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{order.code}</td>
                                            <td>{order.date}</td>
                                            <td>{Number(order.total || 0).toLocaleString()}đ</td>
                                            <td>{order.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Account;
