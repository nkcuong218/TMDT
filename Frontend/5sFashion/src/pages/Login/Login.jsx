import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import bannerLogin from '../../assets/Herobanner2.jpg';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
        // Add logic here (API call)
        // Simulating successful login
        localStorage.setItem('isLoggedIn', 'true');
        // Redirect to Product List to browse
        navigate('/products');
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* Left Side: Visual */}
                <div className="login-image">
                    <img src={bannerLogin} alt="Fashion Model" />
                    <div className="login-overlay">
                        <h2>5S FASHION</h2>
                        <p>Trải nghiệm phong cách thời trang nam đẳng cấp.</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="login-form-container">
                    <Link to="/" className="home-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Trang chủ
                    </Link>
                    <h1 className="login-title">Đăng Nhập</h1>
                    <p className="login-subtitle">Chào mừng bạn quay trở lại!</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email hoặc Số điện thoại</label>
                            <input
                                type="text"
                                className="form-input"
                                name="email"
                                placeholder="Nhập email hoặc số điện thoại"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                className="form-input"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" /> Ghi nhớ đăng nhập
                            </label>
                            <a href="#" className="forgot-password">Quên mật khẩu?</a>
                        </div>

                        <button type="submit" className="login-btn">ĐĂNG NHẬP</button>
                    </form>

                    <div className="social-login">
                        <p>Hoặc đăng nhập với</p>
                        <div className="social-icons">
                            <button className="social-icon-btn">
                                {/* Google SVG */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.25 17.21 15.81 18.11V21.09H19.62C21.85 19.04 23.49 15.96 23.49 12.275Z" fill="#4285F4" />
                                    <path d="M12 24C15.24 24 17.965 22.935 19.965 21.09L16.155 18.11C15.065 18.84 13.68 19.31 12 19.31C8.875 19.31 6.22 17.2 5.265 14.39H1.32V17.45C3.325 21.435 7.42 24 12 24Z" fill="#34A853" />
                                    <path d="M5.26498 14.3899C5.01498 13.6399 4.87498 12.8399 4.87498 11.9999C4.87498 11.1599 5.01498 10.3599 5.26498 9.60991V6.54991H1.31998C0.479981 8.21991 9.80554e-05 10.0599 9.80554e-05 11.9999C9.80554e-05 13.9399 0.479981 15.7799 1.31998 17.4499L5.26498 14.3899Z" fill="#FBBC05" />
                                    <path d="M12 4.69C13.77 4.69 15.35 5.3 16.605 6.49L19.99 3.105C17.965 1.215 15.235 0 12 0C7.42 0 3.325 2.565 1.32 6.55L5.27 9.61C6.22 6.8 8.875 4.69 12 4.69Z" fill="#EA4335" />
                                </svg>
                            </button>
                            <button className="social-icon-btn">
                                {/* Facebook SVG */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 23.991V15.56H7.078V12.073H10.125V9.43C10.125 6.425 11.916 4.76 14.656 4.76C15.968 4.76 17.343 4.995 17.343 4.995V7.953H15.829C14.339 7.953 13.875 8.875 13.875 9.822V12.073H17.203L16.67 15.56H13.875V23.991C19.612 23.094 24 18.1 24 12.073Z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="register-link">
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
