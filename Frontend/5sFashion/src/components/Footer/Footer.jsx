import bct from '../../assets/bct.png'
import logo from '../../assets/logo.png' // Or logo-5s.png
import zaloIcon from '../../assets/ic-zalo.svg'
import { Box, Typography, Button, InputBase } from '@mui/material'


const Footer = () => {
  const socialSx = {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    color: 'var(--text-main)',
    '&:hover': { backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)', color: 'var(--white)' }
  }

  return (
    <Box component="footer" sx={{ backgroundColor: 'var(--bg-light)', borderTop: '1px solid var(--border-color)', py: '60px', pb: '20px', color: 'var(--text-main)', mt: '60px' }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: '16px' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '2fr 1fr 1fr 1.5fr' }, gap: { xs: '24px', sm: '30px', lg: '40px' }, mb: '40px' }}>
          <Box>
            <Box component="img" src={logo} alt="5S Fashion" style={{ height: '40px', marginBottom: '20px' }} />
            <Box>
              <Typography component="p" variant="body1" sx={{ lineHeight: 1.6, fontSize: '14px', color: 'var(--text-light)', mb: '12px' }}>Hệ thống thời trang nam 5S Fashion chuyên cung cấp các sản phẩm thời trang nam chất lượng cao, thiết kế hiện đại.</Typography>
              <Typography component="p" variant="body1" sx={{ lineHeight: 1.6, fontSize: '14px', color: 'var(--text-light)', mb: '12px' }}><Box component="strong">Hotline:</Box> 1800.8118</Typography>
              <Typography component="p" variant="body1" sx={{ lineHeight: 1.6, fontSize: '14px', color: 'var(--text-light)', mb: '12px' }}><Box component="strong">Email:</Box> cskh@5sfashion.vn</Typography>
              <Typography component="p" variant="body1" sx={{ lineHeight: 1.6, fontSize: '14px', color: 'var(--text-light)', mb: '12px' }}><Box component="strong">Địa chỉ:</Box> Số 123 Đường Fashion, Quận 1, TP.HCM</Typography>
            </Box>
            <Box component="img" src={bct} alt="Da Thong Bao Bo Cong Thuong" sx={{ mt: '20px', width: 150 }} />
          </Box>

          <Box>
            <Typography component="h4" variant="h6" sx={{ fontSize: '16px', fontWeight: 700, mb: '20px', textTransform: 'uppercase', color: 'var(--text-main)' }}>Về Chúng Tôi</Typography>
            <Box component="ul">
              <Box component="li" sx={{ mb: '12px' }}><Box component="a" href="#" sx={{ color: 'var(--text-light)', fontSize: '14px', '&:hover': { color: 'var(--primary-color)' } }}>Giới thiệu</Box></Box>
              <Box component="li" sx={{ mb: '12px' }}><Box component="a" href="#" sx={{ color: 'var(--text-light)', fontSize: '14px', '&:hover': { color: 'var(--primary-color)' } }}>Liên hệ</Box></Box>
              <Box component="li" sx={{ mb: '12px' }}><Box component="a" href="#" sx={{ color: 'var(--text-light)', fontSize: '14px', '&:hover': { color: 'var(--primary-color)' } }}>Tuyển dụng</Box></Box>
              <Box component="li" sx={{ mb: '12px' }}><Box component="a" href="#" sx={{ color: 'var(--text-light)', fontSize: '14px', '&:hover': { color: 'var(--primary-color)' } }}>Tin tức</Box></Box>
            </Box>
          </Box>

          <Box>
            <Typography component="h4" variant="h6" sx={{ fontSize: '16px', fontWeight: 700, mb: '20px', textTransform: 'uppercase', color: 'var(--text-main)' }}>Hỗ Trợ Khách Hàng</Typography>
            <Box component="ul">
              <Box component="li" sx={{ mb: '12px' }}><Box component="a" href="#" sx={{ color: 'var(--text-light)', fontSize: '14px', '&:hover': { color: 'var(--primary-color)' } }}>Hướng dẫn mua hàng</Box></Box>
              <Box component="li" sx={{ mb: '12px' }}><Box component="a" href="#" sx={{ color: 'var(--text-light)', fontSize: '14px', '&:hover': { color: 'var(--primary-color)' } }}>Chính sách đổi trả</Box></Box>
              <Box component="li" sx={{ mb: '12px' }}><Box component="a" href="#" sx={{ color: 'var(--text-light)', fontSize: '14px', '&:hover': { color: 'var(--primary-color)' } }}>Chính sách bảo mật</Box></Box>
              <Box component="li" sx={{ mb: '12px' }}><Box component="a" href="#" sx={{ color: 'var(--text-light)', fontSize: '14px', '&:hover': { color: 'var(--primary-color)' } }}>Khách hàng thân thiết</Box></Box>
            </Box>
          </Box>

          <Box>
            <Typography component="h4" variant="h6" sx={{ fontSize: '16px', fontWeight: 700, mb: '20px', textTransform: 'uppercase', color: 'var(--text-main)' }}>Đăng Ký Nhận Tin</Typography>
            <Typography component="p" variant="body1" sx={{ lineHeight: 1.6, fontSize: '14px', color: 'var(--text-light)', mb: '12px' }}>Nhận thông tin cập nhật về sản phẩm mới và các chương trình khuyến mãi hấp dẫn.</Typography>
            <Box component="form" sx={{ display: 'flex', mt: '16px' }}>
              <InputBase type="email" placeholder="Email của bạn..." sx={{ flex: 1, px: '16px', py: '10px', border: '1px solid var(--border-color)', borderRight: 'none', borderRadius: '4px 0 0 4px', outline: 'none', fontFamily: 'var(--font-body)', backgroundColor: 'var(--bg-surface)' }} />
              <Button type="submit" sx={{ backgroundColor: 'var(--primary-color)', color: 'var(--white)', px: '20px', borderRadius: '0 4px 4px 0', fontWeight: 600, textTransform: 'uppercase', '&:hover': { backgroundColor: 'var(--primary-hover)' } }}>Gửi</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: '16px', mt: '20px' }}>
              <Box component="a" href="#" sx={socialSx}>
                <Box component="img" src={zaloIcon} alt="Zalo" width="18" sx={{ transition: 'all 0.3s' }} />
              </Box>
              {/* Facebook Icon SVG */}
              <Box component="a" href="#" sx={socialSx}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </Box>
              {/* Youtube Icon SVG */}
              <Box component="a" href="#" sx={socialSx}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderTop: '1px solid var(--border-color)', pt: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-light)' }}>
                  &copy; 2025 5S Fashion. All rights reserved.
        </Box>
      </Box>
    </Box>
  )
}

export default Footer
