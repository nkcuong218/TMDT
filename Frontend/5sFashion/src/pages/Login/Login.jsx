import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bannerLogin from '../../assets/Herobanner2.jpg'
import { loginUser } from '../../services/catalogApi'
import { Box, Typography, Button, Checkbox, InputBase } from '@mui/material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const auth = await loginUser({
        identifier: formData.email,
        password: formData.password
      })

      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user_role', auth.role || 'customer')
      localStorage.setItem('user_id', String(auth.id))
      localStorage.setItem('auth_token', auth.token || '')

      navigate('/')
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại')
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
        {/* Left Side: Visual */}
        <Box sx={{ flex: 1, backgroundColor: '#ffebee', display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <Box component="img" src={bannerLogin} alt="Fashion Model" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(218, 37, 29, 0.2), rgba(0, 0, 0, 0.4))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: '40px', color: 'white' }}>
            <Typography component="h2" variant="h4" sx={{ fontSize: '32px', fontWeight: 700, mb: '10px', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>5S FASHION</Typography>
            <Typography component="p" variant="body1" sx={{ fontSize: '16px', opacity: 0.9 }}>Trải nghiệm phong cách thời trang nam đẳng cấp.</Typography>
          </Box>
        </Box>

        {/* Right Side: Form */}
        <Box sx={{ flex: 1, p: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '20px', color: 'var(--text-light)', textDecoration: 'none', fontSize: '14px' }}>
            <HomeOutlinedIcon sx={{ fontSize: 16 }} />
            Trang chủ
          </Link>
          <Typography component="h1" variant="h3" sx={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', mb: '8px' }}>Đăng Nhập</Typography>
          <Typography component="p" variant="body1" sx={{ color: 'var(--text-light)', mb: '32px', fontSize: '15px' }}>Chào mừng bạn quay trở lại!</Typography>

          {error ? (
            <Box style={{ color: '#dc2626', marginBottom: '12px', fontSize: '14px' }}>{error}</Box>
          ) : null}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: '24px' }}>
              <Box component="label" sx={{ display: 'block', fontSize: '14px', fontWeight: 500, mb: '8px', color: 'var(--text-main)' }}>Email hoặc Số điện thoại</Box>
              <InputBase
                type="text"
                sx={formInputSx}
                name="email"
                placeholder="Nhập email hoặc số điện thoại"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Box>

            <Box sx={{ mb: '24px' }}>
              <Box component="label" sx={{ display: 'block', fontSize: '14px', fontWeight: 500, mb: '8px', color: 'var(--text-main)' }}>Mật khẩu</Box>
              <InputBase
                type="password"
                sx={formInputSx}
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '32px', fontSize: '14px' }}>
              <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)' }}>
                <Checkbox type="checkbox" /> Ghi nhớ đăng nhập
              </Box>
              <Box component="a" href="#" sx={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 500 }}>Quên mật khẩu?</Box>
            </Box>

            <Button type="submit" disabled={isSubmitting} sx={{ width: '100%', py: '14px', background: 'var(--primary-color)', borderRadius: '8px', color: 'var(--white)', fontWeight: 600, fontSize: '16px', boxShadow: '0 4px 12px rgba(218, 37, 29, 0.3)', '&:hover': { background: 'var(--primary-hover)', transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(218, 37, 29, 0.4)' } }}>
              {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
            </Button>
          </Box>

          <Box sx={{ mt: '32px', textAlign: 'center' }}>
            <Typography component="p" variant="body1" sx={{ color: 'var(--text-light)', fontSize: '14px', mb: '16px' }}>Hoặc đăng nhập với</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <Button sx={{ width: 48, height: 48, border: '1px solid var(--border-color)', borderRadius: '50%', minWidth: 'auto', bgcolor: 'var(--bg-surface)' }}>
                <GoogleIcon sx={{ fontSize: 24, color: '#DB4437' }} />
              </Button>
              <Button sx={{ width: 48, height: 48, border: '1px solid var(--border-color)', borderRadius: '50%', minWidth: 'auto', bgcolor: 'var(--bg-surface)' }}>
                <FacebookRoundedIcon sx={{ fontSize: 24, color: '#1877F2' }} />
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-light)' }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
