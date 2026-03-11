import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import bannerRegister from '../../assets/Herobanner1.jpg'; // Different banner
import { registerUser } from '../../services/catalogApi';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mat khau xac nhan khong khop');
            return;
        }

        setIsSubmitting(true);
        try {
            await registerUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            setSuccessMessage('Dang ky thanh cong. Dang chuyen sang trang dang nhap...');
            setTimeout(() => navigate('/login'), 1000);
        } catch (err) {
            setError(err.message || 'Dang ky that bai');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-wrapper">
                {/* Right Side: Visual (Flipped compared to Login) */}
                <div className="register-image">
                    <img src={bannerRegister} alt="Fashion Model" />
                    <div className="register-overlay">
                        <h2>THAM GIA NGAY</h2>
                        <p>Trở thành thành viên để nhận ưu đãi đặc biệt.</p>
                    </div>
                </div>

                {/* Left Side: Form */}
                <div className="register-form-container">
                    <Link to="/" className="home-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Trang chủ
                    </Link>
                    <h1 className="register-title">Đăng Ký</h1>
                    <p className="register-subtitle">Tạo tài khoản 5S Fashion mới hoàn toàn miễn phí.</p>

                    {error ? (
                        <div style={{ color: '#dc2626', marginBottom: '12px', fontSize: '14px' }}>{error}</div>
                    ) : null}
                    {successMessage ? (
                        <div style={{ color: '#15803d', marginBottom: '12px', fontSize: '14px' }}>{successMessage}</div>
                    ) : null}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Họ của bạn</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="lastName"
                                    placeholder="Họ"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Tên của bạn</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="firstName"
                                    placeholder="Tên"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                name="email"
                                placeholder="Nhập địa chỉ email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                type="tel"
                                className="form-input"
                                name="phone"
                                placeholder="Nhập số điện thoại"
                                value={formData.phone}
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
                                placeholder="Tạo mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nhập lại mật khẩu</label>
                            <input
                                type="password"
                                className="form-input"
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="register-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
                        </button>
                    </form>

                    <div className="login-link">
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
