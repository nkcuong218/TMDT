import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { getCart, removeCartItem, toCartItemViewModel, updateCartItem } from '../../services/catalogApi'
import { Box, Typography, Button, InputBase } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const Cart = () => {
  const navigate = useNavigate()
  const userId = Number(localStorage.getItem('user_id') || 1)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCart = async () => {
    try {
      setLoading(true)
      setError('')
      const cart = await getCart(userId)
      setCartItems((cart?.items || []).map(toCartItemViewModel))
    } catch (err) {
      setError(err.message || 'Khong the tai gio hang')
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find((entry) => entry.id === id)
    if (!item) {
      return
    }

    const newQty = Math.max(1, item.quantity + delta)
    try {
      await updateCartItem(userId, id, newQty)
      await loadCart()
    } catch (err) {
      setError(err.message || 'Cap nhat so luong that bai')
    }
  }

  const handleRemove = async (id) => {
    try {
      await removeCartItem(userId, id)
      await loadCart()
    } catch (err) {
      setError(err.message || 'Xoa san pham that bai')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 500000 ? 0 : 30000
  const total = subtotal + shipping

  useEffect(() => {
    window.scrollTo(0, 0)
    loadCart()
  }, [])

  return (
    <Layout>
      <Box sx={{ backgroundColor: 'var(--bg-body)', padding: '40px 0', minHeight: '80vh' }}>
        <Box className="container">
          <Typography component="h1" variant="h3" sx={{ fontSize: '24px', fontWeight: 700, mb: '25px', textTransform: 'uppercase' }}>Giỏ hàng của bạn ({cartItems.length} sản phẩm )</Typography>

          {error && <Typography component="p" variant="body1" style={{ color: 'red', marginBottom: '12px' }}>{error}</Typography>}
          {loading && <Typography component="p" variant="body1">Dang tai gio hang...</Typography>}

          {!loading && cartItems.length > 0 ? (
            <Box sx={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Items List */}
              <Box sx={{ flex: 2, background: 'var(--bg-surface)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '20px' }}>
                <Box sx={{ display: 'flex', pb: '15px', borderBottom: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-light)', fontSize: '14px' }}>
                  <Box sx={{ flex: 3 }}>Sản phẩm</Box>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>Đơn giá</Box>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>Số lượng</Box>
                  <Box sx={{ flex: 1, textAlign: 'right' }}>Thành tiền</Box>
                  <Box sx={{ flex: 0.5 }}></Box>
                </Box>

                {cartItems.map(item => (
                  <Box sx={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-color)', '&:last-child': { borderBottom: 'none' } }} key={item.id}>
                    <Box sx={{ flex: 3, display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Link to={`/product/${item.product_id}`}>
                        <Box component="img" src={item.image} alt={item.title} sx={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '4px', mr: '15px' }} />
                      </Link>
                      <Box>
                        <Link to={`/product/${item.product_id}`} style={{ textDecoration: 'none' }}>
                          <Typography component="h3" variant="h5" sx={{ fontSize: '15px', fontWeight: 600, mb: '5px', color: 'var(--text-main)' }}>{item.title}</Typography>
                        </Link>
                        <Box sx={{ fontSize: '13px', color: 'var(--text-light)' }}>Màu: {item.color} / Size: {item.size}</Box>
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'center', fontWeight: 600, color: 'var(--text-main)' }}>
                      {item.price.toLocaleString()}đ
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Button sx={{ width: '24px', height: '24px', minWidth: 'unset', background: 'var(--bg-muted)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px', color: 'var(--text-main)', p: 0 }} onClick={() => handleQuantityChange(item.id, -1)}>-</Button>
                      <InputBase type="text" sx={{ width: '30px', height: '24px', textAlign: 'center', border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 600, input: { textAlign: 'center', p: 0 } }} value={item.quantity} readOnly />
                      <Button sx={{ width: '24px', height: '24px', minWidth: 'unset', background: 'var(--bg-muted)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px', color: 'var(--text-main)', p: 0 }} onClick={() => handleQuantityChange(item.id, 1)}>+</Button>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'right', fontWeight: 700, color: 'var(--primary-color)' }}>
                      {(item.price * item.quantity).toLocaleString()}đ
                    </Box>
                    <Box sx={{ flex: 0.5, textAlign: 'right' }}>
                      <Button sx={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', minWidth: 'unset', p: '4px', '&:hover': { color: '#ff4d4f' } }} onClick={() => handleRemove(item.id)} title="Xóa">
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Summary Box */}
              <Box sx={{ flex: 1, background: 'var(--bg-surface)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '25px', position: 'sticky', top: '90px' }}>
                <Box sx={{ fontSize: '18px', fontWeight: 700, mb: '20px', pb: '15px', borderBottom: '1px solid var(--border-color)' }}>Thông Tin Đơn Hàng</Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px', fontSize: '14px', color: 'var(--text-light)' }}>
                  <Box component="span">Tạm tính:</Box>
                  <Box component="span">{subtotal.toLocaleString()}₫</Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px', fontSize: '14px', color: 'var(--text-light)' }}>
                  <Box component="span">Phí vận chuyển:</Box>
                  <Box component="span">{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString()}₫`}</Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px', pt: '20px', borderTop: '1px solid var(--border-color)', fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                  <Box component="span">Tổng cộng:</Box>
                  <Box component="span" sx={{ color: 'var(--primary-color)' }}>{total.toLocaleString()}₫</Box>
                </Box>
                <Button sx={{ width: '100%', height: '45px', background: 'var(--bg-muted)', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '6px', fontWeight: 700, textTransform: 'uppercase', mt: '20px', cursor: 'pointer', '&:hover': { background: 'var(--primary-color)', color: 'var(--white)' } }} onClick={() => navigate('/checkout')}>Thanh Toán</Button>
                <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '15px', fontSize: '13px', color: 'var(--text-light)', textDecoration: 'underline' }}>Tiếp tục mua sắm</Link>
              </Box>
            </Box>
          ) : (
            <Box style={{ textAlign: 'center', padding: '50px' }}>
              <Typography component="p" variant="body1">Giỏ hàng của bạn đang trống.</Typography>
              <Link to="/" style={{ textDecoration: 'underline', color: 'blue' }}>Mua sắm ngay</Link>
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  )
}
export default Cart
