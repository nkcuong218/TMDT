import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { createOrder, getCart, toCartItemViewModel } from '../../services/catalogApi'
import {
  Box,
  Button,
  Select,
  MenuItem,
  Radio,
  InputBase,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import CloseIcon from '@mui/icons-material/Close'

const sectionCardSx = {
  p: '24px',
  borderRadius: '10px',
  border: '1px solid #f0f0f0',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
}

const sectionTitleSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  mb: '18px',
  pb: '12px',
  borderBottom: '1px solid #efefef',
  fontSize: '16px',
  fontWeight: 800,
  textTransform: 'uppercase'
}

const numberBadgeSx = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: '#111827',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 700
}

const inputSx = {
  width: '100%',
  height: '42px',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  px: '12px',
  fontSize: '14px',
  '& input': { p: 0, height: '100%' }
}

const addressCardSx = (active) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  p: '14px',
  border: '1px solid',
  borderColor: active ? 'var(--primary-color)' : '#e0e0e0',
  borderRadius: '8px',
  bgcolor: active ? '#fff8f7' : '#fff',
  cursor: 'pointer',
  transition: 'all .2s'
})

const paymentCardSx = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  p: '14px',
  border: '1px solid',
  borderColor: active ? '#111827' : '#e0e0e0',
  borderRadius: '8px',
  bgcolor: active ? '#fafafa' : '#fff',
  cursor: 'pointer'
})

const voucherCardSx = (active, type) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  p: '12px',
  mb: '10px',
  border: '1px solid',
  borderColor: active ? (type === 'shipping' ? '#14b8a6' : 'var(--primary-color)') : '#e0e0e0',
  borderLeft: '4px solid',
  borderLeftColor: type === 'shipping' ? '#14b8a6' : 'var(--primary-color)',
  borderRadius: '8px',
  bgcolor: active ? (type === 'shipping' ? '#f0fdfa' : '#fff5f5') : '#fff',
  cursor: 'pointer'
})

const Checkout = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loadingCart, setLoadingCart] = useState(true)

  const [savedAddresses] = useState([
    { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', type: 'Nhà Riêng' },
    { id: 2, name: 'Trần Thị B', phone: '0987654321', address: 'Tòa nhà Bitexco, Quận 1, TP.HCM', type: 'Văn Phòng' }
  ])
  const [selectedAddressId, setSelectedAddressId] = useState(1)
  const [isNewAddress, setIsNewAddress] = useState(false)

  const [availableVouchers] = useState([
    { id: 1, code: 'FREESHIP', amount: 30000, desc: 'Giảm tối đa 30k phí vận chuyển', type: 'shipping' },
    { id: 2, code: '5SNEW', amount: 50000, desc: 'Giảm 50k cho đơn hàng từ 0đ', type: 'order' },
    { id: 3, code: 'SALE10K', amount: 10000, desc: 'Giảm 10k cho mọi đơn hàng', type: 'order' }
  ])

  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [selectedShippingVoucherId, setSelectedShippingVoucherId] = useState(null)
  const [selectedOrderVoucherId, setSelectedOrderVoucherId] = useState(null)
  const [manualVoucherInput, setManualVoucherInput] = useState('')

  const [shippingDiscount, setShippingDiscount] = useState(0)
  const [orderDiscount, setOrderDiscount] = useState(0)

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingFee = subtotal > 500000 ? 0 : 30000
  const total = Math.max(0, subtotal + shippingFee - shippingDiscount - orderDiscount)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      alert('Vui long dang nhap de thanh toan.')
      navigate('/login')
      return
    }

    const fetchCart = async () => {
      try {
        const data = await getCart(userId)
        const items = (data?.items || []).map(toCartItemViewModel)
        setCartItems(items)
      } catch (err) {
        alert(err.message || 'Khong the tai gio hang.')
      } finally {
        setLoadingCart(false)
      }
    }

    fetchCart()
  }, [navigate])

  useEffect(() => {
    if (selectedShippingVoucherId) {
      const voucher = availableVouchers.find((x) => x.id === selectedShippingVoucherId)
      setShippingDiscount(voucher ? Math.min(voucher.amount, shippingFee) : 0)
    } else {
      setShippingDiscount(0)
    }

    if (selectedOrderVoucherId) {
      const voucher = availableVouchers.find((x) => x.id === selectedOrderVoucherId)
      setOrderDiscount(voucher ? voucher.amount : 0)
    } else {
      setOrderDiscount(0)
    }
  }, [selectedShippingVoucherId, selectedOrderVoucherId, shippingFee, availableVouchers])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleApplyManual = () => {
    alert(`Tính năng nhập mã thủ công: ${manualVoucherInput} (Chưa implement logic check thực tế)`)
  }

  const toggleShippingVoucher = (id) => {
    if (selectedShippingVoucherId === id) setSelectedShippingVoucherId(null)
    else setSelectedShippingVoucherId(id)
  }

  const toggleOrderVoucher = (id) => {
    if (selectedOrderVoucherId === id) setSelectedOrderVoucherId(null)
    else setSelectedOrderVoucherId(id)
  }

  const getVoucherLabel = () => {
    let count = 0
    if (selectedShippingVoucherId) count++
    if (selectedOrderVoucherId) count++
    if (count === 0) return 'Chọn hoặc nhập mã'
    return `Đã chọn ${count} mã ưu đãi`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      alert('Gio hang dang trong.')
      return
    }

    const userId = Number(localStorage.getItem('user_id'))
    if (!userId) {
      alert('Vui long dang nhap de thanh toan.')
      navigate('/login')
      return
    }

    const finalAddress = isNewAddress
      ? { name: formData.fullName, phone: formData.phone, address: formData.address }
      : savedAddresses.find((a) => a.id === selectedAddressId)

    if (!finalAddress?.name || !finalAddress?.phone || !finalAddress?.address) {
      alert('Vui long dien day du thong tin nguoi nhan.')
      return
    }

    try {
      const selectedOrderVoucher = availableVouchers.find((x) => x.id === selectedOrderVoucherId)
      const selectedShippingVoucher = availableVouchers.find((x) => x.id === selectedShippingVoucherId)
      const voucherCode = selectedOrderVoucher?.code || selectedShippingVoucher?.code || null

      let streetAddress = formData.address || ''
      let district = formData.district || ''
      let city = formData.city || ''

      if (!isNewAddress && finalAddress?.address) {
        const parts = String(finalAddress.address).split(',').map((x) => x.trim()).filter(Boolean)
        streetAddress = parts[0] || finalAddress.address
        district = parts[1] || district
        city = parts[2] || city
      }

      const payload = {
        userId,
        fullName: finalAddress.name,
        phone: finalAddress.phone,
        streetAddress,
        district,
        city,
        address: finalAddress.address,
        note: formData.note || '',
        paymentMethod: paymentMethod.toUpperCase(),
        shippingFee,
        voucherCode,
        discountAmount: shippingDiscount + orderDiscount,
        saveAsDefaultAddress: isNewAddress
      }

      const response = await createOrder(payload)
      alert(`Dat hang thanh cong! Ma don: ${response.code}`)
      navigate('/')
    } catch (err) {
      alert(err.message || 'Dat hang that bai.')
    }
  }

  return (
    <Layout>
      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '90vh', py: { xs: '20px', md: '40px' } }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            px: '16px',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: '24px'
          }}
        >
          <Stack spacing={2.5}>
            <Paper sx={sectionCardSx}>
              <Box sx={sectionTitleSx}>
                <Box sx={numberBadgeSx}>1</Box>
                <LocationOnOutlinedIcon sx={{ color: 'var(--primary-color)' }} />
                <Box component="span">Địa chỉ nhận hàng</Box>
              </Box>

              <Stack spacing={1.5}>
                {savedAddresses.map((addr) => (
                  <Box
                    key={addr.id}
                    component="label"
                    sx={addressCardSx(selectedAddressId === addr.id && !isNewAddress)}
                  >
                    <Radio
                      checked={selectedAddressId === addr.id && !isNewAddress}
                      onChange={() => {
                        setSelectedAddressId(addr.id)
                        setIsNewAddress(false)
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', mb: '4px' }}>
                        <Typography sx={{ fontWeight: 700 }}>{addr.name}</Typography>
                        <Typography sx={{ color: '#666' }}>{addr.phone}</Typography>
                        {addr.type && <Chip size="small" label={addr.type} />}
                      </Box>
                      <Typography sx={{ color: '#555', fontSize: '14px' }}>{addr.address}</Typography>
                    </Box>
                  </Box>
                ))}

                <Box component="label" sx={addressCardSx(isNewAddress)}>
                  <Radio
                    checked={isNewAddress}
                    onChange={() => {
                      setSelectedAddressId(null)
                      setIsNewAddress(true)
                    }}
                  />
                  <Typography sx={{ fontWeight: 700 }}>Sử dụng địa chỉ khác</Typography>
                </Box>
              </Stack>

              {isNewAddress && (
                <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid #eee' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '16px' }}>
                    <Box>
                      <Typography sx={{ mb: '6px', fontSize: '13px', fontWeight: 600 }}>Họ tên *</Typography>
                      <InputBase name="fullName" required sx={inputSx} onChange={handleChange} />
                    </Box>
                    <Box>
                      <Typography sx={{ mb: '6px', fontSize: '13px', fontWeight: 600 }}>SĐT *</Typography>
                      <InputBase name="phone" required sx={inputSx} onChange={handleChange} />
                    </Box>
                    <Box sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }}>
                      <Typography sx={{ mb: '6px', fontSize: '13px', fontWeight: 600 }}>Địa chỉ *</Typography>
                      <InputBase name="address" required sx={inputSx} onChange={handleChange} />
                    </Box>
                    <Box>
                      <Typography sx={{ mb: '6px', fontSize: '13px', fontWeight: 600 }}>Tỉnh/Thành</Typography>
                      <Select name="city" required sx={inputSx} onChange={handleChange} defaultValue="">
                        <MenuItem value="">Chọn tỉnh/thành</MenuItem>
                        <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                        <MenuItem value="TP.HCM">TP.HCM</MenuItem>
                      </Select>
                    </Box>
                    <Box>
                      <Typography sx={{ mb: '6px', fontSize: '13px', fontWeight: 600 }}>Quận/Huyện</Typography>
                      <Select name="district" required sx={inputSx} onChange={handleChange} defaultValue="">
                        <MenuItem value="">Chọn quận/huyện</MenuItem>
                        <MenuItem value="Quận 1">Quận 1</MenuItem>
                        <MenuItem value="Hai Bà Trưng">Hai Bà Trưng</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>

            <Paper sx={sectionCardSx}>
              <Box sx={sectionTitleSx}>
                <Box sx={numberBadgeSx}>2</Box>
                <LocalOfferOutlinedIcon sx={{ color: 'var(--primary-color)' }} />
                <Box component="span">Mã ưu đãi / Voucher</Box>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
                <InputBase
                  sx={inputSx}
                  placeholder="Nhập mã voucher"
                  value={manualVoucherInput}
                  onChange={(e) => setManualVoucherInput(e.target.value)}
                />
                <Button type="button" onClick={handleApplyManual} sx={{ px: '20px', bgcolor: 'var(--primary-color)', color: '#fff', '&:hover': { bgcolor: '#c62828' } }}>
                  Áp dụng
                </Button>
              </Stack>

              <Button
                type="button"
                onClick={() => setShowVoucherModal(true)}
                variant="outlined"
                sx={{
                  width: '100%',
                  justifyContent: 'space-between',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                  py: '10px',
                  '&:hover': { borderColor: 'var(--text-light)', bgcolor: 'var(--bg-muted)' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LocalOfferOutlinedIcon sx={{ color: 'var(--primary-color)' }} />
                  <Box component="span">Chọn Voucher</Box>
                </Box>
                <Typography sx={{ color: 'var(--primary-color)', fontWeight: 600 }}>{getVoucherLabel()}</Typography>
              </Button>
            </Paper>

            <Paper sx={sectionCardSx}>
              <Box sx={sectionTitleSx}>
                <Box sx={numberBadgeSx}>3</Box>
                <PaymentsOutlinedIcon sx={{ color: 'var(--primary-color)' }} />
                <Box component="span">Phương thức thanh toán</Box>
              </Box>

              <Stack spacing={1.5}>
                <Box component="label" sx={paymentCardSx(paymentMethod === 'cod')}>
                  <Radio checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <Typography sx={{ fontWeight: 600 }}>Thanh toán khi nhận hàng (COD)</Typography>
                </Box>
                <Box component="label" sx={paymentCardSx(paymentMethod === 'banking')}>
                  <Radio checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} />
                  <Typography sx={{ fontWeight: 600 }}>Chuyển khoản ngân hàng</Typography>
                </Box>
                <Box component="label" sx={paymentCardSx(paymentMethod === 'momo')}>
                  <Radio checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} />
                  <Typography sx={{ fontWeight: 600 }}>Ví MoMo</Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>

          <Paper sx={{ ...sectionCardSx, height: 'fit-content', position: { xs: 'static', lg: 'sticky' }, top: { lg: '90px' } }}>
            <Box sx={{ ...sectionTitleSx, mb: '14px' }}>
              <ReceiptLongOutlinedIcon sx={{ color: 'var(--primary-color)' }} />
              <Box component="span">Đơn hàng ({cartItems.length})</Box>
            </Box>

            {loadingCart && <Typography>Dang tai gio hang...</Typography>}

            <Box sx={{ maxHeight: '360px', overflowY: 'auto', mb: 2 }}>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', gap: '12px', pb: '12px', mb: '12px', borderBottom: '1px dashed #e5e7eb' }}>
                  <Box component="img" src={item.image} alt="" sx={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '4px' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: '4px' }}>{item.title}</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#888' }}>{item.color} | {item.size} | x{item.quantity}</Typography>
                    <Typography sx={{ fontSize: '13px', fontWeight: 700, mt: '4px' }}>{(item.price * item.quantity).toLocaleString()}đ</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Tạm tính</Typography><Typography fontWeight={700}>{subtotal.toLocaleString()}đ</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Phí vận chuyển</Typography><Typography fontWeight={700}>{shippingFee.toLocaleString()}đ</Typography></Box>
              {shippingDiscount > 0 && <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#14b8a6' }}><Typography>Giảm phí vận chuyển</Typography><Typography fontWeight={700}>-{shippingDiscount.toLocaleString()}đ</Typography></Box>}
              {orderDiscount > 0 && <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-color)' }}><Typography>Voucher giảm giá</Typography><Typography fontWeight={700}>-{orderDiscount.toLocaleString()}đ</Typography></Box>}
              <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '16px' }}>Tổng cộng</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '22px', color: 'var(--primary-color)' }}>{total.toLocaleString()}đ</Typography>
              </Box>
            </Stack>

            <Button type="submit" sx={{ mt: 2.5, width: '100%', height: '50px', bgcolor: 'var(--primary-color)', color: '#fff', fontSize: '16px', fontWeight: 800, '&:hover': { bgcolor: '#c62828' } }}>
              ĐẶT HÀNG
            </Button>
          </Paper>
        </Box>

        <Dialog open={showVoucherModal} onClose={() => setShowVoucherModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Chọn 5S Fashion Voucher
            <IconButton onClick={() => setShowVoucherModal(false)}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: '#f8f9fa' }}>
            <Typography sx={{ fontSize: '13px', color: '#666', mb: 1 }}>Mã Miễn Phí Vận Chuyển</Typography>
            {availableVouchers.filter((v) => v.type === 'shipping').map((v) => (
              <Box key={v.id} sx={voucherCardSx(selectedShippingVoucherId === v.id, 'shipping')} onClick={() => toggleShippingVoucher(v.id)}>
                <Radio checked={selectedShippingVoucherId === v.id} readOnly />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{v.code}</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#666' }}>{v.desc}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: '#14b8a6' }}>-{v.amount.toLocaleString()}đ</Typography>
              </Box>
            ))}

            <Typography sx={{ fontSize: '13px', color: '#666', mb: 1, mt: 2 }}>Mã Giảm Giá / Hoàn Xu</Typography>
            {availableVouchers.filter((v) => v.type === 'order').map((v) => (
              <Box key={v.id} sx={voucherCardSx(selectedOrderVoucherId === v.id, 'order')} onClick={() => toggleOrderVoucher(v.id)}>
                <Radio checked={selectedOrderVoucherId === v.id} readOnly />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{v.code}</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#666' }}>{v.desc}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: 'var(--primary-color)' }}>-{v.amount.toLocaleString()}đ</Typography>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowVoucherModal(false)} variant="outlined">HUỶ</Button>
            <Button onClick={() => setShowVoucherModal(false)} variant="contained" sx={{ bgcolor: 'var(--primary-color)' }}>ĐỒNG Ý</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  )
}

export default Checkout
