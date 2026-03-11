import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { getDashboardData } from '../../../services/catalogApi';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getDashboardData();
                if (!isMounted) {
                    return;
                }
                setStats(data?.stats || []);
                setSalesData(data?.salesData || []);
                setCategoryData(data?.categoryData || []);
                setRecentOrders(data?.recentOrders || []);
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Khong the tai dashboard');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();
        return () => {
            isMounted = false;
        };
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-success';
            case 'Pending': return 'status-warning';
            case 'Processing': return 'status-warning';
            case 'Cancelled': return 'status-danger';
            default: return '';
        }
    };

    return (
        <AdminLayout title="Dashboard">
            {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}
            {loading && <p style={{ marginBottom: 16 }}>Dang tai du lieu dashboard...</p>}

            {/* Stats Grid */}
            <div className="admin-stats-grid">
                {stats.map((stat, index) => (
                    <div className="stat-card" key={index}>
                        <div className="stat-title">{stat.label}</div>
                        <div className="stat-value">{stat.value}</div>
                        <div className={`stat-trend ${stat.isUp ? 'trend-up' : 'trend-down'}`}>
                            {stat.trend} so với tháng trước
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>

                {/* Revenue Area Chart */}
                <div className="admin-card" style={{ marginBottom: 0 }}>
                    <h3 style={{ marginBottom: '20px' }}>Doanh Thu 7 Ngày Qua</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <RechartsTooltip formatter={(value) => `${value.toLocaleString()}đ`} />
                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" name="Doanh Thu" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="admin-card" style={{ marginBottom: 0 }}>
                    <h3 style={{ marginBottom: '20px' }}>Tỷ Lệ Danh Mục</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-card">
                <h3 style={{ marginBottom: '20px' }}>Đơn Hàng Gần Đây</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã Đơn</th>
                            <th>Khách Hàng</th>
                            <th>Ngày Đặt</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{order.date}</td>
                                <td><b>{order.total}</b></td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="action-btn">Xem</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </AdminLayout>
    );
};

export default AdminDashboard;
