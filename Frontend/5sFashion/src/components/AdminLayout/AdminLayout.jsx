import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import './AdminLayout.css';

import logo from '../../assets/logo.png';

const AdminLayout = ({ children, title }) => {
    const location = useLocation();

    // RBAC Check
    // For development, we ensure 'user_role' is checked.
    // If not admin, redirect to home.
    const role = localStorage.getItem('user_role');
    if (role !== 'admin' && role !== 'ADMIN') {
        // You might want to remove the alert for production or smoother UX
        // alert('Access Denied: Admin role required.'); 
        return <Navigate to="/" replace />;
    }

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
        { path: '/admin/products', label: 'Sản Phẩm', icon: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z' },
        { path: '/admin/orders', label: 'Đơn Hàng', icon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
        { path: '/admin/users', label: 'Khách Hàng', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
        { path: '/admin/warehouse', label: 'Quản Lý Kho', icon: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 15l3-3V9l-3 3v7zm8 0h-2v-4h2v4zm2 0h-2v-4h2v4zm0-6h-2v-4h2v4zm2-6h-2V5h2v2z' },
    ];

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <img src={logo} alt="5S Admin" className="admin-logo" />
                </div>
                <nav className="admin-nav">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d={item.icon} />
                            </svg>
                            {item.label}
                        </Link>
                    ))}
                    <div style={{ borderTop: '1px solid #374151', margin: '10px 0' }}></div>
                    <Link to="/" className="admin-nav-item">
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                        Về Trang Chủ
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                <header className="admin-header">
                    <div className="header-title">{title || 'Dashboard'}</div>
                    <div className="admin-user">
                        <span>Admin User</span>
                        <div style={{ width: 32, height: 32, borderRadius: 50, background: '#ddd' }}></div>
                    </div>
                </header>
                <main className="admin-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
