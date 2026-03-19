import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-5s.png'
import megaMenuBanner from '../../assets/Herobanner1.jpg'
import megaMenuBanner2 from '../../assets/Herobanner2.jpg'
import megaMenuBanner3 from '../../assets/Herobanner3.jpg'
import { Box, Typography, Button, InputBase } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

const navLinkSx = {
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '14px',
  color: 'var(--text-main)',
  position: 'relative',
  textDecoration: 'none',
  padding: '28px 0',
  '&:hover': { color: 'var(--primary-color)' },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '20px',
    left: 0,
    width: 0,
    height: '2px',
    backgroundColor: 'var(--primary-color)',
    transition: 'width 0.3s ease'
  },
  '&:hover::after': { width: '100%' }
}

const megaMenuSx = {
  position: 'absolute',
  top: '100%',
  left: 0,
  width: '100%',
  backgroundColor: 'var(--bg-surface)',
  borderTop: '1px solid var(--border-color)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  padding: '30px 0',
  opacity: 0,
  visibility: 'hidden',
  transform: 'translateY(10px)',
  transition: 'all 0.3s ease',
  zIndex: 9999
}

const navItemSx = {
  position: 'static',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  '&:hover > .MuiBox-root[data-megamenu]': {
    opacity: 1,
    visibility: 'visible',
    transform: 'translateY(0)'
  }
}

const megaColTitleSx = {
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--text-main)',
  mb: '20px',
  textTransform: 'uppercase',
  borderBottom: '2px solid var(--text-main)',
  display: 'inline-block',
  pb: '4px'
}

const megaLinkSx = {
  textDecoration: 'none',
  color: 'var(--text-main)',
  fontSize: '14px',
  transition: 'color 0.2s',
  '&:hover': { color: 'var(--primary-color)' }
}

const dropdownItemSx = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '12px 15px',
  background: 'none',
  border: 'none',
  fontSize: '14px',
  color: 'var(--text-main)',
  cursor: 'pointer',
  transition: 'background 0.2s',
  textTransform: 'none',
  '&:hover': { background: 'var(--bg-muted)', color: 'var(--secondary-color)' }
}

// Inject hover CSS for nav-item mega menu (pure CSS hover can't be done with sx alone on sibling)
if (typeof document !== 'undefined' && !document.getElementById('header-megamenu-hover')) {
  const s = document.createElement('style')
  s.id = 'header-megamenu-hover'
  s.textContent = '.nav-item-hover:hover .mega-menu-box{opacity:1!important;visibility:visible!important;transform:translateY(0)!important;}'
  document.head.appendChild(s)
}

const Header = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true')
  const [showDropdown, setShowDropdown] = useState(false)

  const user = { name: 'Nguyễn Văn A' }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
    setShowDropdown(false)
    navigate('/')
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'var(--bg-light)', boxShadow: 'var(--shadow-sm)', borderBottom: '1px solid var(--border-color)' }}>
      {/* Top Bar */}
      <Box sx={{ backgroundColor: 'var(--primary-color)', color: 'var(--white)', fontSize: '12px', padding: '8px 0', textAlign: 'center' }}>
        <Box className="container" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', height: '100%' }}>
          <Box component="span">BST Thu Đông 2025 - Giá Trải Nghiệm -30%</Box>
          <Box sx={{ display: 'flex', gap: '20px' }}>
            {isLoggedIn && localStorage.getItem('user_role') === 'admin' && (
              <Link to="/admin" style={{ color: 'var(--white)', fontWeight: 'bold' }}>Trang Quản Trị</Link>
            )}
            <Box component="span">Hotline: 1800.8118</Box>
            <Box component="span">Hệ thống cửa hàng</Box>
          </Box>
        </Box>
      </Box>

      <Box className="container" sx={{ height: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'static' }}>
        {/* Logo */}
        <Box component="a" href="/">
          <Box component="img" src={logo} alt="5S Fashion" sx={{ height: '40px', width: 'auto' }} />
        </Box>

        {/* Nav */}
        <Box component="nav" sx={{ display: 'flex', gap: '32px', height: '100%', alignItems: 'center' }}>
          {/* SALE */}
          <Box className="nav-item-hover" sx={navItemSx}>
            <Box component="a" href="#" sx={{ ...navLinkSx, color: 'var(--secondary-color)', fontWeight: 'bold' }}>SALE</Box>
          </Box>

          {/* NAM */}
          <Box className="nav-item-hover" sx={navItemSx}>
            <Link to="/category/nam" style={{ ...navLinkSx }}>Nam</Link>
            <Box className="mega-menu-box" sx={megaMenuSx}>
              <Box className="container" sx={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>ÁO NAM</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['ao-thun-nam', 'ao-polo-nam', 'ao-so-mi-nam', 'ao-ba-lo-nam', 'ao-chong-nang-nam', 'ao-thun-dai-tay-nam', 'ao-polo-dai-tay-nam', 'ao-ni-nam', 'ao-len-nam', 'ao-khoac-nam', 'ao-bomber-nam', 'ao-khoac-gio-nam', 'ao-phao-nam', 'vest-nam'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Áo Thun', 'Áo Polo', 'Áo Sơ Mi', 'Áo Ba Lỗ', 'Áo Chống Nắng', 'Áo Thun Dài Tay', 'Áo Polo Dài Tay', 'Áo Nỉ', 'Áo Len', 'Áo Khoác', 'Áo Bomber', 'Áo Khoác Gió', 'Áo Phao', 'Áo Vest - Áo Blazer'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>QUẦN NAM</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['quan-short-nam', 'quan-short-the-thao-nam', 'quan-short-kaki-nam', 'quan-short-tay-nam', 'quan-short-casual-nam', 'quan-dai-the-thao-nam', 'quan-dai-kaki-nam', 'quan-tay-nam', 'quan-jeans-nam'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Quần Short Nam', 'Quần Short Thể Thao', 'Quần Short Kaki', 'Quần Short Tây', 'Quần Short Casual', 'Quần Dài Thể Thao', 'Quần Dài Kaki', 'Quần Tây', 'Quần Jeans'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>PHỤ KIỆN</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['quan-lot-nam', 'quan-lot-boxer-nam', 'quan-lot-brief-nam', 'tat-nam'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Quần Lót', 'Quần Lót Boxer', 'Quần Lót Brief', 'Tất Nam'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>ĐỒ BỘ NAM</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['bo-ni-nam', 'bo-the-thao-nam', 'bo-vest-nam'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Bộ Nỉ', 'Bộ Thể Thao', 'Bộ Vest'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'flex-start' }}>
                  <Box component="img" src={megaMenuBanner} alt="Men Collection" sx={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* NỮ */}
          <Box className="nav-item-hover" sx={navItemSx}>
            <Link to="/category/nu" style={{ ...navLinkSx }}>Nữ</Link>
            <Box className="mega-menu-box" sx={megaMenuSx}>
              <Box className="container" sx={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>ÁO NỮ</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['ao-thun-nu', 'ao-so-mi-nu', 'ao-len-nu', 'ao-ni-nu', 'ao-giu-nhiet-nu', 'ao-phao-nu', 'ao-gio-nu', 'ao-khoac-nu', 'ao-bomber-nu'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Áo Thun', 'Áo Sơ Mi', 'Áo Len', 'Áo Nỉ', 'Áo Giữ Nhiệt', 'Áo Phao', 'Áo Gió', 'Áo Khoác Thời Trang', 'Áo Bomber'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>QUẦN NỮ</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['quan-au-nu', 'quan-jeans-nu', 'quan-khac-nu'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Quần Âu', 'Quần Jeans', 'Quần Khác'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>VÁY NỮ</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    <Box component="li" sx={{ mb: '12px' }}><Link to="/category/chan-vay-nu" style={megaLinkSx}>Chân Váy</Link></Box>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>PHỤ KIỆN</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    <Box component="li" sx={{ mb: '12px' }}><Link to="/category/tat-chan-nu" style={megaLinkSx}>Tất Chân</Link></Box>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>ĐỒ BỘ NỮ</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['bo-do-gio-nu', 'bo-mac-nha-nu', 'bo-ni-nu'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Bộ Đồ Gió', 'Bộ Mặc Nhà', 'Bộ Nỉ'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'flex-start' }}>
                  <Box component="img" src={megaMenuBanner2} alt="Women Collection" sx={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* BÉ TRAI */}
          <Box className="nav-item-hover" sx={navItemSx}>
            <Link to="/category/be-trai" style={{ ...navLinkSx }}>Bé Trai</Link>
            <Box className="mega-menu-box" sx={megaMenuSx}>
              <Box className="container" sx={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>ÁO BÉ TRAI</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['ao-thun-be-trai', 'ao-so-mi-be-trai', 'ao-ni-be-trai', 'ao-giu-nhiet-be-trai', 'ao-len-be-trai', 'ao-bomber-be-trai', 'ao-gio-be-trai', 'ao-khoac-be-trai', 'ao-phao-be-trai'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Áo Thun', 'Áo Sơ Mi', 'Áo Nỉ', 'Áo Giữ Nhiệt', 'Áo Len', 'Áo Bomber', 'Áo Gió', 'Áo Khoác Thời Trang', 'Áo Phao'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>QUẦN BÉ TRAI</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['quan-casual-be-trai', 'quan-jeans-be-trai', 'quan-kaki-be-trai'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Quần Dài Casual', 'Quần Jeans', 'Quần Kaki'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>PHỤ KIỆN BÉ TRAI</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    <Box component="li" sx={{ mb: '12px' }}><Link to="/category/tat-chan-be-trai" style={megaLinkSx}>Tất Chân</Link></Box>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>BỘ ĐỒ BÉ TRAI</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['bo-mac-nha-be-trai', 'bo-ni-be-trai'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Bộ Mặc Nhà', 'Bộ Nỉ'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'flex-start' }}>
                  <Box component="img" src={megaMenuBanner3} alt="Boys Collection" sx={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* BÉ GÁI */}
          <Box className="nav-item-hover" sx={navItemSx}>
            <Link to="/category/be-gai" style={{ ...navLinkSx }}>Bé Gái</Link>
            <Box className="mega-menu-box" sx={megaMenuSx}>
              <Box className="container" sx={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>ÁO BÉ GÁI</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['ao-thun-be-gai', 'ao-so-mi-be-gai', 'ao-ni-be-gai', 'ao-giu-nhiet-be-gai', 'ao-len-be-gai', 'ao-bomber-be-gai', 'ao-gio-be-gai', 'ao-khoac-be-gai', 'ao-phao-be-gai'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Áo Thun', 'Áo Sơ Mi', 'Áo Nỉ', 'Áo Giữ Nhiệt', 'Áo Len', 'Áo Bomber', 'Áo Gió', 'Áo Khoác Thời Trang', 'Áo Phao'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>QUẦN BÉ GÁI</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['quan-casual-be-gai', 'quan-jeans-be-gai', 'quan-kaki-be-gai', 'quan-legging-be-gai'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Quần Dài Casual', 'Quần Jeans', 'Quần Kaki', 'Quần Legging'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>VÁY BÉ GÁI</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['vay-lien-be-gai', 'chan-vay-be-gai'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Váy Liền', 'Chân Váy'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>PHỤ KIỆN</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    <Box component="li" sx={{ mb: '12px' }}><Link to="/category/tat-chan-be-gai" style={megaLinkSx}>Tất Chân</Link></Box>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>BỘ ĐỒ BÉ GÁI</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['bo-mac-nha-be-gai', 'bo-ni-be-gai', 'bo-thoi-trang-be-gai'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Bộ Mặc Nhà', 'Bộ Nỉ', 'Bộ Thời Trang'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'flex-start' }}>
                  <Box component="img" src={megaMenuBanner2} alt="Girls Collection" sx={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* BỘ SƯU TẬP */}
          <Box className="nav-item-hover" sx={navItemSx}>
            <Link to="/category/bo-suu-tap" style={{ ...navLinkSx }}>Bộ Sưu Tập</Link>
            <Box className="mega-menu-box" sx={megaMenuSx}>
              <Box className="container" sx={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>BỘ SƯU TẬP</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['bst-cong-so', 'bst-the-thao', 'bst-xuan-he', 'bst-thu-dong'].map((s, i) => (
                      <Box component="li" key={s} sx={{ mb: '12px' }}><Link to={`/category/${s}`} style={megaLinkSx}>{['Bộ Sưu Tập Công Sở', 'Bộ Sưu Tập Thể Thao', 'Bộ Sưu Tập Xuân Hè', 'Bộ Sưu Tập Thu Đông'][i]}</Link></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>BST XUÂN HÈ 2025</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    <Box component="li" sx={{ mb: '12px' }}><Link to="/category/bst-tu-hao-sac-ao" style={megaLinkSx}>BST 02/09 - Tự Hào Sắc Áo</Link></Box>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>BST THU ĐÔNG 2025</Typography>
                </Box>
                <Box sx={{ flex: 1 }} />
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'flex-start' }}>
                  <Box component="img" src={megaMenuBanner} alt="Collection Banner" sx={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* VỀ CHÚNG TÔI */}
          <Box className="nav-item-hover" sx={navItemSx}>
            <Box component="a" href="#" sx={navLinkSx}>Về chúng tôi</Box>
            <Box className="mega-menu-box" sx={megaMenuSx}>
              <Box className="container" sx={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={megaColTitleSx}>VỀ CHÚNG TÔI</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {['Giới Thiệu Về 5S Fashion', 'Hệ Thống Cửa Hàng', 'Hướng Dẫn Chọn Size', 'Chính Sách Bảo Mật', 'Chính Sách Giao Hàng', 'Chính Sách Đổi Trả, Bảo Hành', 'Chính Sách Hợp Tác & Đầu Tư', 'Chính Sách Khách Hàng Thân Thiết', 'Tin Tức'].map(t => (
                      <Box component="li" key={t} sx={{ mb: '12px' }}><Box component="a" href="#" sx={megaLinkSx}>{t}</Box></Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }} />
                <Box sx={{ flex: 1 }} />
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'flex-start' }}>
                  <Box component="img" src={megaMenuBanner} alt="About Us" sx={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Header Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '20px', width: '240px', color: 'var(--text-main)' }}>
            <SearchOutlinedIcon sx={{ width: 18, height: 18 }} />
            <InputBase type="text" placeholder="Bạn tìm gì..." sx={{ border: 'none', background: 'transparent', outline: 'none', ml: '8px', width: '100%', fontSize: '14px' }} />
          </Box>

          {/* User Icon */}
          <Box sx={{ position: 'relative' }}>
            {isLoggedIn ? (
              <Button
                onClick={toggleDropdown}
                sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', minWidth: 'unset', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary-color)', '&:hover': { backgroundColor: 'var(--bg-muted)' } }}
              >
                <PersonOutlineOutlinedIcon sx={{ width: 24, height: 24 }} />
              </Button>
            ) : (
              <Link to="/login" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', color: 'var(--text-light)', textDecoration: 'none' }}>
                <PersonOutlineOutlinedIcon sx={{ width: 24, height: 24 }} />
              </Link>
            )}

            {showDropdown && isLoggedIn && (
              <Box sx={{ position: 'absolute', top: '100%', right: 0, width: '200px', background: 'var(--bg-surface)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '8px', mt: '10px', zIndex: 1001, overflow: 'hidden', border: '1px solid var(--border-color)', animation: 'fadeIn 0.2s ease-out', '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(-10px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                <Box sx={{ padding: '15px', fontSize: '14px', color: 'var(--text-main)', background: 'var(--bg-light)' }}>
                  Xin chào, <Box component="strong">{user.name}</Box>
                </Box>
                <Box sx={{ height: '1px', background: 'var(--border-color)' }} />
                <Button sx={dropdownItemSx} onClick={() => navigate('/settings')}>Settings</Button>
                <Button sx={dropdownItemSx} onClick={handleLogout}>Đăng xuất</Button>
              </Box>
            )}
          </Box>

          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', color: 'inherit', textDecoration: 'none' }}>
            <ShoppingCartOutlinedIcon sx={{ width: 24, height: 24 }} />
            <Box component="span" sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'var(--secondary-color)', color: 'var(--white)', fontSize: '10px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</Box>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default Header

