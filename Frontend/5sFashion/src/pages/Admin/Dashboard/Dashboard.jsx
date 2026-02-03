import React from 'react';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminDashboard = () => {
    // Mock Data
    const stats = [
        { label: 'Tổng Doanh Thu', value: '125.000.000đ', trend: '+12%', isUp: true },
        { label: 'Đơn Hàng Mới', value: '38', trend: '+5%', isUp: true },
        { label: 'Khách Hàng', value: '1,240', trend: '+3%', isUp: true },
        { label: 'Sản Phẩm', value: '450', trend: '0%', isUp: true }
    ];

    const recentOrders = [
        { id: '#ORD-001', customer: 'Nguyễn Văn A', date: '03/02/2026', total: '499.000đ', status: 'Pending' },
        { id: '#ORD-002', customer: 'Trần Thị B', date: '03/02/2026', total: '1.250.000đ', status: 'Completed' },
        { id: '#ORD-003', customer: 'Lê Văn C', date: '02/02/2026', total: '299.000đ', status: 'Cancelled' },
        { id: '#ORD-004', customer: 'Phạm Thị D', date: '02/02/2026', total: '850.000đ', status: 'Processing' },
    ];

    // Chart Data
    const salesData = [
        { name: 'T2', revenue: 4000000, orders: 24 },
        { name: 'T3', revenue: 3000000, orders: 18 },
        { name: 'T4', revenue: 5000000, orders: 35 },
        { name: 'T5', revenue: 2780000, orders: 15 },
        { name: 'T6', revenue: 6890000, orders: 42 },
        { name: 'T7', revenue: 8390000, orders: 56 },
        { name: 'CN', revenue: 9490000, orders: 60 },
    ];

    const categoryData = [
        { name: 'Nam', value: 45 },
        { name: 'Nữ', value: 35 },
        { name: 'Trẻ em', value: 20 },
    ];
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
