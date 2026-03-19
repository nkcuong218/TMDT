import { useMemo, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Button,
  InputBase,
  Pagination
} from '@mui/material'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SelectMode from '../../components/SelectMode/selectmode'

const cardSx = {
  p: { xs: '16px', md: '20px' },
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-sm)',
  backgroundColor: 'var(--bg-surface)'
}

const inputSx = {
  width: '100%',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-surface)',
  color: 'var(--text-main)',
  borderRadius: '8px',
  px: '12px',
  py: '10px',
  fontSize: '14px',
  '& input': { p: 0 }
}

const Settings = () => {
  const userName = useMemo(() => localStorage.getItem('user_name') || 'Khách hàng 5S', [])
  const userEmail = useMemo(() => localStorage.getItem('user_email') || 'customer@5sfashion.local', [])

  const [displayName, setDisplayName] = useState(userName)
  const [email, setEmail] = useState(userEmail)
  const [accountTab, setAccountTab] = useState('profile')
  const [language, setLanguage] = useState(localStorage.getItem('settings_language') || 'vi')
  const [themeMode, setThemeMode] = useState(localStorage.getItem('settings_theme_mode') || 'system')
  const [phone, setPhone] = useState(localStorage.getItem('user_phone') || '0901234567')
  const [birthday, setBirthday] = useState(localStorage.getItem('user_birthday') || '')

  const [addressPage, setAddressPage] = useState(1)
  const [passwordPage, setPasswordPage] = useState(1)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const addresses = useMemo(() => ([
    { id: 1, name: 'Nhà riêng', detail: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', isDefault: true },
    { id: 2, name: 'Văn phòng', detail: 'Bitexco, Quận 1, TP.HCM', isDefault: false },
    { id: 3, name: 'Nhà bố mẹ', detail: '65 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', isDefault: false },
    { id: 4, name: 'Kho nhận hàng', detail: '12 Lê Lợi, Hải Châu, Đà Nẵng', isDefault: false }
  ]), [])

  const passwordLogs = useMemo(() => ([
    { id: 1, time: '2026-03-12 10:32', device: 'Chrome - Windows', location: 'Hà Nội' },
    { id: 2, time: '2026-02-20 21:10', device: 'Safari - iPhone', location: 'TP.HCM' },
    { id: 3, time: '2026-01-03 08:18', device: 'Edge - Windows', location: 'Đà Nẵng' },
    { id: 4, time: '2025-12-11 14:45', device: 'Chrome - MacOS', location: 'Hà Nội' }
  ]), [])

  const itemsPerPage = 2
  const pagedAddresses = addresses.slice((addressPage - 1) * itemsPerPage, addressPage * itemsPerPage)
  const pagedPasswordLogs = passwordLogs.slice((passwordPage - 1) * itemsPerPage, passwordPage * itemsPerPage)

  const [emailOrder, setEmailOrder] = useState(localStorage.getItem('settings_email_order') !== 'false')
  const [emailPromo, setEmailPromo] = useState(localStorage.getItem('settings_email_promo') === 'true')
  const [pushEnabled, setPushEnabled] = useState(localStorage.getItem('settings_push_enabled') === 'true')

  const [compactMode, setCompactMode] = useState(localStorage.getItem('settings_compact_mode') === 'true')
  const [reduceMotion, setReduceMotion] = useState(localStorage.getItem('settings_reduce_motion') === 'true')

  const [twoFactor, setTwoFactor] = useState(localStorage.getItem('settings_2fa') === 'true')
  const [rememberDevice, setRememberDevice] = useState(localStorage.getItem('settings_remember_device') !== 'false')

  const handleSave = () => {
    localStorage.setItem('user_name', displayName)
    localStorage.setItem('user_email', email)
    localStorage.setItem('user_phone', phone)
    localStorage.setItem('user_birthday', birthday)

    localStorage.setItem('settings_language', language)
    localStorage.setItem('settings_theme_mode', themeMode)

    localStorage.setItem('settings_email_order', String(emailOrder))
    localStorage.setItem('settings_email_promo', String(emailPromo))
    localStorage.setItem('settings_push_enabled', String(pushEnabled))

    localStorage.setItem('settings_compact_mode', String(compactMode))
    localStorage.setItem('settings_reduce_motion', String(reduceMotion))

    localStorage.setItem('settings_2fa', String(twoFactor))
    localStorage.setItem('settings_remember_device', String(rememberDevice))

    alert('Đã lưu cài đặt thành công')
  }

  return (
    <Layout>
      <Box sx={{ backgroundColor: 'var(--bg-body)', minHeight: '85vh', py: { xs: '20px', md: '32px' } }}>
        <Box sx={{ maxWidth: '1180px', mx: 'auto', px: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '18px' }}>
            <SettingsOutlinedIcon sx={{ color: 'var(--primary-color)' }} />
            <Typography component="h1" variant="h4" sx={{ fontSize: { xs: '24px', md: '30px' }, fontWeight: 800 }}>
              Cài Đặt Tài Khoản
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            <Paper sx={cardSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '14px' }}>
                <PersonOutlineOutlinedIcon sx={{ color: 'var(--primary-color)' }} />
                <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Thông tin cá nhân</Typography>
              </Box>
              <Divider sx={{ mb: '14px' }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px 1fr' }, gap: '18px' }}>
                <Box>
                  <Stack spacing={1}>
                    <Typography
                      onClick={() => setAccountTab('profile')}
                      sx={{ fontSize: '16px', cursor: 'pointer', color: accountTab === 'profile' ? 'var(--primary-color)' : 'var(--text-main)' }}
                    >
                        Hồ Sơ
                    </Typography>
                    <Typography
                      onClick={() => setAccountTab('address')}
                      sx={{ fontSize: '16px', cursor: 'pointer', color: accountTab === 'address' ? 'var(--primary-color)' : 'var(--text-main)' }}
                    >
                        Địa Chỉ
                    </Typography>
                    <Typography
                      onClick={() => setAccountTab('password')}
                      sx={{ fontSize: '16px', cursor: 'pointer', color: accountTab === 'password' ? 'var(--primary-color)' : 'var(--text-main)' }}
                    >
                        Đổi Mật Khẩu
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  {accountTab === 'profile' && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '14px' }}>
                      <Box>
                        <Typography sx={{ fontSize: '13px', mb: '6px', color: 'var(--text-light)' }}>Tên hiển thị</Typography>
                        <InputBase value={displayName} onChange={(e) => setDisplayName(e.target.value)} sx={inputSx} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '13px', mb: '6px', color: 'var(--text-light)' }}>Email</Typography>
                        <InputBase value={email} onChange={(e) => setEmail(e.target.value)} sx={inputSx} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '13px', mb: '6px', color: 'var(--text-light)' }}>Số điện thoại</Typography>
                        <InputBase value={phone} onChange={(e) => setPhone(e.target.value)} sx={inputSx} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '13px', mb: '6px', color: 'var(--text-light)' }}>Ngày sinh</Typography>
                        <InputBase type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} sx={inputSx} />
                      </Box>
                    </Box>
                  )}

                  {accountTab === 'address' && (
                    <Stack spacing={1.5}>
                      {pagedAddresses.map((addr) => (
                        <Box key={addr.id} sx={{ p: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-surface)' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                            {addr.name} {addr.isDefault ? '(Mặc định)' : ''}
                          </Typography>
                          <Typography sx={{ fontSize: '13px', color: 'var(--text-light)', mt: '4px' }}>{addr.detail}</Typography>
                        </Box>
                      ))}
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: '6px' }}>
                        <Pagination
                          count={Math.ceil(addresses.length / itemsPerPage)}
                          page={addressPage}
                          onChange={(_, page) => setAddressPage(page)}
                          size="small"
                          sx={{ '& .MuiPaginationItem-root': { color: 'var(--text-main)' }, '& .Mui-selected': { bgcolor: 'rgba(218, 37, 29, 0.16) !important', color: 'var(--primary-color)' } }}
                        />
                      </Box>
                    </Stack>
                  )}

                  {accountTab === 'password' && (
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography sx={{ fontSize: '13px', mb: '6px', color: 'var(--text-light)' }}>Mật khẩu hiện tại</Typography>
                        <InputBase type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} sx={inputSx} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '13px', mb: '6px', color: 'var(--text-light)' }}>Mật khẩu mới</Typography>
                        <InputBase type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} sx={inputSx} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '13px', mb: '6px', color: 'var(--text-light)' }}>Nhập lại mật khẩu mới</Typography>
                        <InputBase type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} sx={inputSx} />
                      </Box>
                      <Button type="button" variant="outlined" sx={{ alignSelf: 'flex-start', color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                        Cập nhật mật khẩu
                      </Button>

                      <Divider sx={{ my: '6px' }} />
                      <Typography sx={{ fontSize: '13px', color: 'var(--text-light)' }}>Lịch sử đổi mật khẩu</Typography>
                      {pagedPasswordLogs.map((log) => (
                        <Box key={log.id} sx={{ p: '10px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-surface)' }}>
                          <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{log.time}</Typography>
                          <Typography sx={{ fontSize: '12px', color: 'var(--text-light)' }}>{log.device} - {log.location}</Typography>
                        </Box>
                      ))}
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: '6px' }}>
                        <Pagination
                          count={Math.ceil(passwordLogs.length / itemsPerPage)}
                          page={passwordPage}
                          onChange={(_, page) => setPasswordPage(page)}
                          size="small"
                          sx={{ '& .MuiPaginationItem-root': { color: 'var(--text-main)' }, '& .Mui-selected': { bgcolor: 'rgba(218, 37, 29, 0.16) !important', color: 'var(--primary-color)' } }}
                        />
                      </Box>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Paper>

            <Paper sx={cardSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '14px' }}>
                <SettingsOutlinedIcon sx={{ color: 'var(--primary-color)' }} />
                <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Giao diện & ngôn ngữ</Typography>
              </Box>
              <Divider sx={{ mb: '14px' }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '14px', alignItems: 'start' }}>
                <Box>
                  <Typography sx={{ fontSize: '13px', mb: '6px', color: 'var(--text-light)' }}>Ngôn ngữ</Typography>
                  <Select value={language} onChange={(e) => setLanguage(e.target.value)} sx={{ minWidth: 220, height: 42, color: 'var(--text-main)', '& fieldset': { borderColor: 'var(--border-color)' } }}>
                    <MenuItem value="vi">Tiếng Việt</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </Box>
                <SelectMode value={themeMode} onChange={setThemeMode} />
                <Stack sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                  <FormControlLabel control={<Switch checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} />} label="Chế độ hiển thị gọn" />
                  <FormControlLabel control={<Switch checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} />} label="Giảm hiệu ứng chuyển động" />
                </Stack>
              </Box>
            </Paper>

            <Paper sx={cardSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '14px' }}>
                <NotificationsOutlinedIcon sx={{ color: 'var(--primary-color)' }} />
                <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Thông báo</Typography>
              </Box>
              <Divider sx={{ mb: '14px' }} />
              <Stack>
                <FormControlLabel control={<Switch checked={emailOrder} onChange={(e) => setEmailOrder(e.target.checked)} />} label="Nhận email cập nhật đơn hàng" />
                <FormControlLabel control={<Switch checked={emailPromo} onChange={(e) => setEmailPromo(e.target.checked)} />} label="Nhận email khuyến mãi" />
                <FormControlLabel control={<Switch checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} />} label="Bật thông báo trình duyệt" />
              </Stack>
            </Paper>

            <Paper sx={cardSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '14px' }}>
                <SecurityOutlinedIcon sx={{ color: 'var(--primary-color)' }} />
                <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Bảo mật</Typography>
              </Box>
              <Divider sx={{ mb: '14px' }} />
              <Stack>
                <FormControlLabel control={<Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />} label="Bật xác thực 2 lớp" />
                <FormControlLabel control={<Switch checked={rememberDevice} onChange={(e) => setRememberDevice(e.target.checked)} />} label="Ghi nhớ thiết bị tin cậy" />
              </Stack>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button type="button" variant="outlined" onClick={() => window.history.back()}>
                  Quay lại
              </Button>
              <Button type="button" variant="contained" onClick={handleSave} sx={{ bgcolor: 'var(--primary-color)', '&:hover': { bgcolor: 'var(--primary-hover)' } }}>
                Lưu cài đặt
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Layout>
  )
}

export default Settings
