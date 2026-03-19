import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bannerRegister from '../../assets/Herobanner1.jpg' // Different banner
import { registerUser } from '../../services/catalogApi'
import { Box, Typography, Button, InputBase } from '@mui/material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'


const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (formData.password !== formData.confirmPassword) {
      setError('Mat khau xac nhan khong khop')
      return
    }

    setIsSubmitting(true)
    try {
      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })

      setSuccessMessage('Dang ky thanh cong. Dang chuyen sang trang dang nhap...')
      setTimeout(() => navigate('/login'), 1000)
    } catch (err) {
      setError(err.message || 'Dang ky that bai')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formInputSx = {
    width: '100%',
    px: '16px',
    py: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'all 0.3s',
    outline: 'none'
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', p: '40px 20px', backgroundColor: 'var(--bg-body)' }}>
      <Box sx={{ display: 'flex', width: { xs: '100%', md: '1000px' }, maxWidth: '100%', background: 'var(--bg-surface)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)' }}>
        {/* Right Side: Visual (Flipped compared to Login) */}
        <Box sx={{ flex: 1, backgroundColor: '#ffebee', display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', order: 2 }}>
          <Box component="img" src={bannerRegister} alt="Fashion Model" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(218, 37, 29, 0.2), rgba(0, 0, 0, 0.4))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: '40px', color: 'white' }}>
            <Typography component="h2" variant="h4" sx={{ fontSize: '32px', fontWeight: 700, mb: '10px', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>THAM GIA NGAY</Typography>
            <Typography component="p" variant="body1" sx={{ fontSize: '16px', opacity: 0.9 }}>Trở thành thành viên để nhận ưu đãi đặc biệt.</Typography>
          </Box>
        </Box>

        {/* Left Side: Form */}
        <Box sx={{ flex: 1, p: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', order: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '20px', color: 'var(--text-light)', textDecoration: 'none', fontSize: '14px' }}>
            <HomeOutlinedIcon sx={{ fontSize: 16 }} />
                        Trang chủ
          </Link>
          <Typography component="h1" variant="h3" sx={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', mb: '8px' }}>Đăng Ký</Typography>
          <Typography component="p" variant="body1" sx={{ color: 'var(--text-light)', mb: '24px', fontSize: '15px' }}>Tạo tài khoản 5S Fashion mới hoàn toàn miễn phí.</Typography>

          {error ? (
            <Box style={{ color: '#dc2626', marginBottom: '12px', fontSize: '14px' }}>{error}</Box>
          ) : null}
          {successMessage ? (
            <Box style={{ color: '#15803d', marginBottom: '12px', fontSize: '14px' }}>{successMessage}</Box>
          ) : null}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <Box sx={{ mb: '20px', flex: 1 }}>
                <Box component="label" sx={{ display: 'block', fontSize: '14px', fontWeight: 500, mb: '8px', color: 'var(--text-main)' }}>Họ của bạn</Box>
                <InputBase
                  type="text"
                  sx={formInputSx}
                  name="lastName"
                  placeholder="Họ"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={{ mb: '20px', flex: 1 }}>
                <Box component="label" sx={{ display: 'block', fontSize: '14px', fontWeight: 500, mb: '8px', color: 'var(--text-main)' }}>Tên của bạn</Box>
                <InputBase
                  type="text"
                  sx={formInputSx}
                  name="firstName"
                  placeholder="Tên"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Box>
            </Box>

            <Box sx={{ mb: '20px' }}>
              <Box component="label" sx={{ display: 'block', fontSize: '14px', fontWeight: 500, mb: '8px', color: 'var(--text-main)' }}>Email</Box>
              <InputBase
                type="email"
                sx={formInputSx}
                name="email"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Box>

            <Box sx={{ mb: '20px' }}>
              <Box component="label" sx={{ display: 'block', fontSize: '14px', fontWeight: 500, mb: '8px', color: 'var(--text-main)' }}>Số điện thoại</Box>
              <InputBase
                type="tel"
                sx={formInputSx}
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Box>

            <Box sx={{ mb: '20px' }}>
              <Box component="label" sx={{ display: 'block', fontSize: '14px', fontWeight: 500, mb: '8px', color: 'var(--text-main)' }}>Mật khẩu</Box>
              <InputBase
                type="password"
                sx={formInputSx}
                name="password"
                placeholder="Tạo mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Box>

            <Box sx={{ mb: '20px' }}>
              <Box component="label" sx={{ display: 'block', fontSize: '14px', fontWeight: 500, mb: '8px', color: 'var(--text-main)' }}>Nhập lại mật khẩu</Box>
              <InputBase
                type="password"
                sx={formInputSx}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Box>

            <Button type="submit" disabled={isSubmitting} sx={{ width: '100%', py: '14px', background: 'var(--primary-color)', borderRadius: '8px', color: 'var(--white)', fontWeight: 600, fontSize: '16px', boxShadow: '0 4px 12px rgba(218, 37, 29, 0.3)', mt: '10px', '&:hover': { background: 'var(--primary-hover)', transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(218, 37, 29, 0.4)' } }}>
              {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
            </Button>
          </Box>

          <Box sx={{ mt: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-light)' }}>
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Register
