import React from 'react';
import './Footer.css';
import bct from '../../assets/bct.png';
import logo from '../../assets/logo.png'; // Or logo-5s.png
import zaloIcon from '../../assets/ic-zalo.svg';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-col">
                        <img src={logo} alt="5S Fashion" style={{ height: '40px', marginBottom: '20px' }} />
                        <div className="footer-info">
                            <p>Hệ thống thời trang nam 5S Fashion chuyên cung cấp các sản phẩm thời trang nam chất lượng cao, thiết kế hiện đại.</p>
                            <p><strong>Hotline:</strong> 1800.8118</p>
                            <p><strong>Email:</strong> cskh@5sfashion.vn</p>
                            <p><strong>Địa chỉ:</strong> Số 123 Đường Fashion, Quận 1, TP.HCM</p>
                        </div>
                        <img src={bct} alt="Da Thong Bao Bo Cong Thuong" className="bct-img" />
                    </div>

                    <div className="footer-col">
                        <h4>Về Chúng Tôi</h4>
                        <ul className="footer-links">
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Liên hệ</a></li>
                            <li><a href="#">Tuyển dụng</a></li>
                            <li><a href="#">Tin tức</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Hỗ Trợ Khách Hàng</h4>
                        <ul className="footer-links">
                            <li><a href="#">Hướng dẫn mua hàng</a></li>
                            <li><a href="#">Chính sách đổi trả</a></li>
                            <li><a href="#">Chính sách bảo mật</a></li>
                            <li><a href="#">Khách hàng thân thiết</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Đăng Ký Nhận Tin</h4>
                        <p className="footer-info">Nhận thông tin cập nhật về sản phẩm mới và các chương trình khuyến mãi hấp dẫn.</p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Email của bạn..." className="newsletter-input" />
                            <button type="submit" className="newsletter-btn">Gửi</button>
                        </form>
                        <div className="social-links">
                            <a href="#" className="social-btn">
                                <img src={zaloIcon} alt="Zalo" width="18" className="zalo-icon" />
                            </a>
                            {/* Facebook Icon SVG */}
                            <a href="#" className="social-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            {/* Youtube Icon SVG */}
                            <a href="#" className="social-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    &copy; 2025 5S Fashion. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
