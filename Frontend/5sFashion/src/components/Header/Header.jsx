import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo-5s.png';
// Import a banner for the mega menu. Using one of the hero banners or a placeholder styling.
import megaMenuBanner from '../../assets/Herobanner1.jpg'; // Example usage
import megaMenuBanner2 from '../../assets/Herobanner2.jpg'; // Women banner
import megaMenuBanner3 from '../../assets/Herobanner3.jpg'; // Boys banner

const Header = () => {
    const navigate = useNavigate();
    // Use state for interactivity, initialize from localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
    const [showDropdown, setShowDropdown] = useState(false);

    const user = { name: "Nguyễn Văn A" };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        setShowDropdown(false);
        navigate('/');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <header className="header-wrapper">
            <div className="top-bar">
                <div className="container flex justify-between items-center" style={{ padding: '0 16px', height: '100%' }}>
                    <div className="top-bar-left">
                        <span>BST Thu Đông 2025 - Giá Trải Nghiệm -30%</span>
                    </div>
                    <div className="top-bar-right" style={{ display: 'flex', gap: '20px' }}>
                        <span>Hotline: 1800.8118</span>
                        <span>Hệ thống cửa hàng</span>
                    </div>
                </div>
            </div>

            <div className="container header-main">
                <div className="logo">
                    <a href="/">
                        <img src={logo} alt="5S Fashion" />
                    </a>
                </div>

                <nav className="nav-menu">
                    <div className="nav-item">
                        <a href="#" className="nav-link" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>SALE</a>
                    </div>

                    {/* NAM Menu Item with Mega Menu */}
                    <div className="nav-item">
                        <Link to="/products" className="nav-link">Nam</Link>
                        <div className="mega-menu">
                            <div className="container mega-menu-content">
                                {/* Column 1: Áo Nam */}
                                <div className="mega-menu-column">
                                    <h3>ÁO NAM</h3>
                                    <ul>
                                        <li><a href="#">Áo Thun</a></li>
                                        <li><a href="#">Áo Polo</a></li>
                                        <li><a href="#">Áo Sơ Mi</a></li>
                                        <li><a href="#">Áo Ba Lỗ</a></li>
                                        <li><a href="#">Áo Chống Nắng</a></li>
                                        <li><a href="#">Áo Thun Dài Tay</a></li>
                                        <li><a href="#">Áo Polo Dài Tay</a></li>
                                        <li><a href="#">Áo Nỉ</a></li>
                                        <li><a href="#">Áo Len</a></li>
                                        <li><a href="#">Áo Khoác</a></li>
                                        <li><a href="#">Áo Bomber</a></li>
                                        <li><a href="#">Áo Khoác Gió</a></li>
                                        <li><a href="#">Áo Phao</a></li>
                                        <li><a href="#">Áo Vest - Áo Blazer</a></li>
                                    </ul>
                                </div>

                                {/* Column 2: Quần Nam */}
                                <div className="mega-menu-column">
                                    <h3>QUẦN NAM</h3>
                                    <ul>
                                        <li><a href="#">Quần Short Nam</a></li>
                                        <li><a href="#">Quần Short Thể Thao</a></li>
                                        <li><a href="#">Quần Short Kaki</a></li>
                                        <li><a href="#">Quần Short Tây</a></li>
                                        <li><a href="#">Quần Short Casual</a></li>
                                        <li><a href="#">Quần Dài Thể Thao</a></li>
                                        <li><a href="#">Quần Dài Kaki</a></li>
                                        <li><a href="#">Quần Tây</a></li>
                                        <li><a href="#">Quần Jeans</a></li>
                                    </ul>
                                </div>

                                {/* Column 3: Phụ Kiện */}
                                <div className="mega-menu-column">
                                    <h3>PHỤ KIỆN</h3>
                                    <ul>
                                        <li><a href="#">Quần Lót</a></li>
                                        <li><a href="#">Quần Lót Boxer</a></li>
                                        <li><a href="#">Quần Lót Brief</a></li>
                                        <li><a href="#">Tất Nam</a></li>
                                    </ul>
                                </div>

                                {/* Column 4: Đồ Bộ Nam */}
                                <div className="mega-menu-column">
                                    <h3>ĐỒ BỘ NAM</h3>
                                    <ul>
                                        <li><a href="#">Bộ Nỉ</a></li>
                                        <li><a href="#">Bộ Thể Thao</a></li>
                                        <li><a href="#">Bộ Vest</a></li>
                                    </ul>
                                </div>

                                {/* Column 5: Image Banner */}
                                <div className="mega-menu-image">
                                    <img src={megaMenuBanner} alt="Men Collection" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NỮ Menu Item with Mega Menu */}
                    <div className="nav-item">
                        <a href="#" className="nav-link">Nữ</a>
                        <div className="mega-menu">
                            <div className="container mega-menu-content">
                                {/* Column 1: Áo Nữ */}
                                <div className="mega-menu-column">
                                    <h3>ÁO NỮ</h3>
                                    <ul>
                                        <li><a href="#">Áo Thun</a></li>
                                        <li><a href="#">Áo Sơ Mi</a></li>
                                        <li><a href="#">Áo Len</a></li>
                                        <li><a href="#">Áo Nỉ</a></li>
                                        <li><a href="#">Áo Giữ Nhiệt</a></li>
                                        <li><a href="#">Áo Phao</a></li>
                                        <li><a href="#">Áo Gió</a></li>
                                        <li><a href="#">Áo Khoác Thời Trang</a></li>
                                        <li><a href="#">Áo Bomber</a></li>
                                    </ul>
                                </div>

                                {/* Column 2: Quần Nữ */}
                                <div className="mega-menu-column">
                                    <h3>QUẦN NỮ</h3>
                                    <ul>
                                        <li><a href="#">Quần Âu</a></li>
                                        <li><a href="#">Quần Jeans</a></li>
                                        <li><a href="#">Quần Khác</a></li>
                                    </ul>
                                </div>

                                {/* Column 3: Váy Nữ */}
                                <div className="mega-menu-column">
                                    <h3>VÁY NỮ</h3>
                                    <ul>
                                        <li><a href="#">Chân Váy</a></li>
                                    </ul>
                                </div>

                                {/* Column 4: Phụ Kiện */}
                                <div className="mega-menu-column">
                                    <h3>PHỤ KIỆN</h3>
                                    <ul>
                                        <li><a href="#">Tất Chân</a></li>
                                    </ul>
                                </div>

                                {/* Column 5: Đồ Bộ Nữ */}
                                <div className="mega-menu-column">
                                    <h3>ĐỒ BỘ NỮ</h3>
                                    <ul>
                                        <li><a href="#">Bộ Đồ Gió</a></li>
                                        <li><a href="#">Bộ Mặc Nhà</a></li>
                                        <li><a href="#">Bộ Nỉ</a></li>
                                    </ul>
                                </div>

                                {/* Column 6: Image Banner */}
                                <div className="mega-menu-image">
                                    <img src={megaMenuBanner2} alt="Women Collection" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* BÉ TRAI Menu Item with Mega Menu */}
                    <div className="nav-item">
                        <a href="#" className="nav-link">Bé Trai</a>
                        <div className="mega-menu">
                            <div className="container mega-menu-content">
                                {/* Column 1: Áo Bé Trai */}
                                <div className="mega-menu-column">
                                    <h3>ÁO BÉ TRAI</h3>
                                    <ul>
                                        <li><a href="#">Áo Thun</a></li>
                                        <li><a href="#">Áo Sơ Mi</a></li>
                                        <li><a href="#">Áo Nỉ</a></li>
                                        <li><a href="#">Áo Giữ Nhiệt</a></li>
                                        <li><a href="#">Áo Len</a></li>
                                        <li><a href="#">Áo Bomber</a></li>
                                        <li><a href="#">Áo Gió</a></li>
                                        <li><a href="#">Áo Khoác Thời Trang</a></li>
                                        <li><a href="#">Áo Phao</a></li>
                                    </ul>
                                </div>

                                {/* Column 2: Quần Bé Trai */}
                                <div className="mega-menu-column">
                                    <h3>QUẦN BÉ TRAI</h3>
                                    <ul>
                                        <li><a href="#">Quần Dài Casual</a></li>
                                        <li><a href="#">Quần Jeans</a></li>
                                        <li><a href="#">Quần Kaki</a></li>
                                    </ul>
                                </div>

                                {/* Column 3: Phụ Kiện Bé Trai */}
                                <div className="mega-menu-column">
                                    <h3>PHỤ KIỆN BÉ TRAI</h3>
                                    <ul>
                                        <li><a href="#">Tất Chân</a></li>
                                    </ul>
                                </div>

                                {/* Column 4: Bộ Đồ Bé Trai */}
                                <div className="mega-menu-column">
                                    <h3>BỘ ĐỒ BÉ TRAI</h3>
                                    <ul>
                                        <li><a href="#">Bộ Mặc Nhà</a></li>
                                        <li><a href="#">Bộ Nỉ</a></li>
                                    </ul>
                                </div>

                                {/* Column 5: Image Banner */}
                                <div className="mega-menu-image">
                                    <img src={megaMenuBanner3} alt="Boys Collection" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* BÉ GÁI Menu Item with Mega Menu */}
                    <div className="nav-item">
                        <a href="#" className="nav-link">Bé Gái</a>
                        <div className="mega-menu">
                            <div className="container mega-menu-content">
                                {/* Column 1: Áo Bé Gái */}
                                <div className="mega-menu-column">
                                    <h3>ÁO BÉ GÁI</h3>
                                    <ul>
                                        <li><a href="#">Áo Thun</a></li>
                                        <li><a href="#">Áo Sơ Mi</a></li>
                                        <li><a href="#">Áo Nỉ</a></li>
                                        <li><a href="#">Áo Giữ Nhiệt</a></li>
                                        <li><a href="#">Áo Len</a></li>
                                        <li><a href="#">Áo Bomber</a></li>
                                        <li><a href="#">Áo Gió</a></li>
                                        <li><a href="#">Áo Khoác Thời Trang</a></li>
                                        <li><a href="#">Áo Phao</a></li>
                                    </ul>
                                </div>

                                {/* Column 2: Quần Bé Gái */}
                                <div className="mega-menu-column">
                                    <h3>QUẦN BÉ GÁI</h3>
                                    <ul>
                                        <li><a href="#">Quần Dài Casual</a></li>
                                        <li><a href="#">Quần Jeans</a></li>
                                        <li><a href="#">Quần Kaki</a></li>
                                        <li><a href="#">Quần Legging</a></li>
                                    </ul>
                                </div>

                                {/* Column 3: Váy Bé Gái */}
                                <div className="mega-menu-column">
                                    <h3>VÁY BÉ GÁI</h3>
                                    <ul>
                                        <li><a href="#">Váy Liền</a></li>
                                        <li><a href="#">Chân Váy</a></li>
                                    </ul>
                                </div>

                                {/* Column 4: Phụ Kiện */}
                                <div className="mega-menu-column">
                                    <h3>PHỤ KIỆN</h3>
                                    <ul>
                                        <li><a href="#">Tất Chân</a></li>
                                    </ul>
                                </div>

                                {/* Column 5: Bộ Đồ Bé Gái */}
                                <div className="mega-menu-column">
                                    <h3>BỘ ĐỒ BÉ GÁI</h3>
                                    <ul>
                                        <li><a href="#">Bộ Mặc Nhà</a></li>
                                        <li><a href="#">Bộ Nỉ</a></li>
                                        <li><a href="#">Bộ Thời Trang</a></li>
                                    </ul>
                                </div>

                                {/* Column 6: Image Banner */}
                                <div className="mega-menu-image">
                                    <img src={megaMenuBanner2} alt="Girls Collection" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* BỘ SƯU TẬP Menu Item with Mega Menu */}
                    <div className="nav-item">
                        <a href="#" className="nav-link">Bộ Sưu Tập</a>
                        <div className="mega-menu">
                            <div className="container mega-menu-content">
                                {/* Column 1: Bộ Sưu Tập */}
                                <div className="mega-menu-column">
                                    <h3>BỘ SƯU TẬP</h3>
                                    <ul>
                                        <li><a href="#">Bộ Sưu Tập Công Sở</a></li>
                                        <li><a href="#">Bộ Sưu Tập Thể Thao</a></li>
                                        <li><a href="#">Bộ Sưu Tập Xuân Hè</a></li>
                                        <li><a href="#">Bộ Sưu Tập Thu Đông</a></li>
                                    </ul>
                                </div>

                                {/* Column 2: BST Xuân Hè 2025 */}
                                <div className="mega-menu-column">
                                    <h3>BST XUÂN HÈ 2025</h3>
                                    <ul>
                                        <li><a href="#">BST 02/09 - Tự Hào Sắc Áo</a></li>
                                    </ul>
                                </div>

                                {/* Column 3: BST Thu Đông 2025 */}
                                <div className="mega-menu-column">
                                    <h3>BST THU ĐÔNG 2025</h3>
                                    <ul>
                                        {/* No items shown in design */}
                                    </ul>
                                </div>

                                {/* Spacer Column to push image right if needed, or just let flex handle it */}
                                <div className="mega-menu-column"></div>

                                {/* Column 5: Image Banner */}
                                <div className="mega-menu-image">
                                    <img src={megaMenuBanner} alt="Collection Banner" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* VỀ CHÚNG TÔI Menu Item with Mega Menu */}
                    <div className="nav-item">
                        <a href="#" className="nav-link">Về chúng tôi</a>
                        <div className="mega-menu">
                            <div className="container mega-menu-content">
                                {/* Column 1: Về chúng tôi - Links */}
                                <div className="mega-menu-column">
                                    <h3>VỀ CHÚNG TÔI</h3>
                                    <ul>
                                        <li><a href="#">Giới Thiệu Về 5S Fashion</a></li>
                                        <li><a href="#">Hệ Thống Cửa Hàng</a></li>
                                        <li><a href="#">Hướng Dẫn Chọn Size</a></li>
                                        <li><a href="#">Chính Sách Bảo Mật</a></li>
                                        <li><a href="#">Chính Sách Giao Hàng</a></li>
                                        <li><a href="#">Chính Sách Đổi Trả, Bảo Hành</a></li>
                                        <li><a href="#">Chính Sách Hợp Tác & Đầu Tư</a></li>
                                        <li><a href="#">Chính Sách Khách Hàng Thân Thiết</a></li>
                                        <li><a href="#">Tin Tức</a></li>
                                    </ul>
                                </div>

                                {/* Flexible Spacer Columns to position layout similar to image */}
                                <div className="mega-menu-column"></div>
                                <div className="mega-menu-column"></div>

                                {/* Column 4: Image Banner */}
                                <div className="mega-menu-image">
                                    <img src={megaMenuBanner} alt="About Us" />
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="header-actions">
                    <div className="search-bar">
                        {/* Simple Search Icon SVG */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Bạn tìm gì..." className="search-input" />
                    </div>

                    {/* User Icon / Logic */}
                    <div className="user-action-container" style={{ position: 'relative' }}>
                        {isLoggedIn ? (
                            <button
                                className="icon-btn"
                                onClick={toggleDropdown}
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--primary-color)' // Active/Black
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </button>
                        ) : (
                            <Link to="/login" className="icon-btn" style={{ color: '#999' }}> {/* Grey when not logged in */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </Link>
                        )}

                        {/* Dropdown Menu */}
                        {showDropdown && isLoggedIn && (
                            <div className="user-dropdown">
                                <div className="dropdown-header">
                                    Xin chào, <strong>{user.name}</strong>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="icon-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span className="cart-badge">0</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
