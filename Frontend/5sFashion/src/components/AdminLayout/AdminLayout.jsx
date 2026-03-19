import { Link, useLocation, Navigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { Box } from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'

export const adminCardSx = {
  background: 'var(--bg-surface)',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  p: 3,
  mb: 3
}

export const adminTableSx = {
  width: '100%',
  borderCollapse: 'collapse',
  '& th': {
    textAlign: 'left',
    p: '12px 16px',
    background: 'var(--bg-muted)',
    color: 'var(--text-light)',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    borderBottom: '1px solid var(--border-color)'
  },
  '& td': {
    p: '14px 16px',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '14px',
    color: 'var(--text-main)'
  }
}

export const actionButtonSx = {
  px: 1.5,
  py: 0.75,
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  bgcolor: 'var(--bg-surface)',
  color: 'var(--text-main)',
  minWidth: 'auto',
  textTransform: 'none',
  fontSize: '13px',
  mr: 0.5,
  '&:hover': { bgcolor: 'var(--bg-muted)' }
}

export const formInputSx = {
  width: '100%',
  px: 1.25,
  py: 1,
  borderRadius: '4px',
  border: '1px solid #d1d5db',
  background: 'var(--bg-surface)',
  fontSize: '14px'
}

export const primaryButtonSx = {
  background: '#ef4444',
  color: '#fff',
  borderRadius: '4px',
  px: 2,
  py: 1,
  textTransform: 'none',
  '&:hover': { background: '#dc2626' }
}

export const secondaryButtonSx = {
  border: '1px solid #d1d5db',
  background: 'var(--bg-surface)',
  color: 'var(--text-main)',
  borderRadius: '4px',
  px: 2,
  py: 1,
  textTransform: 'none',
  '&:hover': { background: 'var(--bg-muted)' }
}

export const statusBadgeSx = (statusClass) => {
  const palette = {
    'status-success': { background: '#d1fae5', color: '#065f46' },
    'status-warning': { background: '#fef3c7', color: '#92400e' },
    'status-danger': { background: '#fee2e2', color: '#b91c1c' }
  }
  return {
    px: 1.25,
    py: 0.5,
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    ...(palette[statusClass] || { background: '#f3f4f6', color: '#374151' })
  }
}


const AdminLayout = ({ children, title }) => {
  const location = useLocation()

  // RBAC Check
  // For development, we ensure 'user_role' is checked.
  // If not admin, redirect to home.
  const role = localStorage.getItem('user_role')
  if (role !== 'admin' && role !== 'ADMIN') {
    // You might want to remove the alert for production or smoother UX
    // alert('Access Denied: Admin role required.');
    return <Navigate to="/" replace />
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: DashboardRoundedIcon },
    { path: '/admin/products', label: 'Sản Phẩm', icon: Inventory2OutlinedIcon },
    { path: '/admin/orders', label: 'Đơn Hàng', icon: ReceiptLongOutlinedIcon },
    { path: '/admin/users', label: 'Khách Hàng', icon: PeopleAltOutlinedIcon },
    { path: '/admin/warehouse', label: 'Quản Lý Kho', icon: WarehouseOutlinedIcon }
  ]

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--bg-body)', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <Box sx={{ width: 250, bgcolor: 'var(--bg-surface)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', left: 0, top: 0, borderRight: '1px solid var(--border-color)', boxShadow: '2px 0 5px rgba(0, 0, 0, 0.02)' }}>
        <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <Box component="img" src={logo} alt="5S Admin" sx={{ height: 32, objectFit: 'contain' }} />
        </Box>
        <Box component="nav" sx={{ flex: 1, py: '20px' }}>
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                color: location.pathname === item.path ? 'var(--primary-color)' : 'var(--text-light)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                fontSize: '15px',
                gap: '12px',
                fontWeight: 500,
                background: location.pathname === item.path ? 'rgba(218, 37, 29, 0.12)' : 'transparent',
                borderLeft: location.pathname === item.path ? '3px solid var(--primary-color)' : '3px solid transparent'
              }}
            >
              <item.icon sx={{ width: 20, height: 20 }} />
              {item.label}
            </Link>
          ))}
          <Box sx={{ borderTop: '1px solid var(--border-color)', my: '10px' }}></Box>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', color: 'var(--text-light)', textDecoration: 'none', fontSize: '15px', gap: '12px', fontWeight: 500 }}>
            <HomeOutlinedIcon sx={{ width: 20, height: 20 }} />
                      Về Trang Chủ
          </Link>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, ml: '250px', display: 'flex', flexDirection: 'column' }}>
        <Box component="header" sx={{ height: 64, background: 'var(--bg-surface)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '30px', borderBottom: '1px solid var(--border-color)' }}>
          <Box sx={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>{title || 'Dashboard'}</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500 }}>
            <Box component="span">Admin User</Box>
            <Box style={{ width: 32, height: 32, borderRadius: 50, background: '#ddd' }}></Box>
          </Box>
        </Box>
        <Box component="main" sx={{ p: '30px', flex: 1, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
