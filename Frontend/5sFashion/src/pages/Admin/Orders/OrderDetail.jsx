import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, adminTableSx, primaryButtonSx, secondaryButtonSx } from '../../../components/AdminLayout/AdminLayout'
import { getAdminOrderDetail, updateAdminOrderStatus } from '../../../services/catalogApi'
import { Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem } from '@mui/material'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setError('')
        const data = await getAdminOrderDetail(id)
        setOrder(data)
      } catch (err) {
        setError(err.message || 'Khong the tai chi tiet don hang')
      }
    }

    fetchOrder()
  }, [id])

  const handleStatusUpdate = async (newStatus) => {
    if (!order || newStatus === order.status) {
      return
    }

    if (window.confirm(`Xác nhận cập nhật trạng thái sang ${newStatus}?`)) {
      try {
        const data = await updateAdminOrderStatus(order.id, newStatus)
        setOrder(data)
        alert('Cập nhật thành công!')
      } catch (err) {
        alert(err.message || 'Khong the cap nhat trang thai')
      }
    }
  }

  if (error) return <AdminLayout>{error}</AdminLayout>
  if (!order) return <AdminLayout>Loading...</AdminLayout>

  return (
    <AdminLayout title={`Chi Tiết Đơn Hàng #${order.code}`}>
      <Box style={{ marginBottom: '20px' }}>
        <Button
          onClick={() => navigate('/admin/orders')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
                    ← Quay lại danh sách
        </Button>
      </Box>

      <Box style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

        {/* Left Column: Order Items & Info */}
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Items Card */}
          <Box sx={adminCardSx}>
            <Typography component="h3" variant="h5" style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Sản Phẩm</Typography>
            <Table sx={adminTableSx}>
              <TableHead>
                <TableRow>
                  <TableCell>Sản Phẩm</TableCell>
                  <TableCell>Đơn Giá</TableCell>
                  <TableCell>SL</TableCell>
                  <TableCell>Tổng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Box style={{ fontWeight: 600, color: '#333' }}>{item.name}</Box>
                      <Box style={{ fontSize: '12px', color: '#777' }}>SKU: {item.sku} | {item.size} / {item.color}</Box>
                    </TableCell>
                    <TableCell>{item.price.toLocaleString()}đ</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{(item.price * item.quantity).toLocaleString()}đ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <tfoot>
                <TableRow>
                  <TableCell colSpan="3" style={{ textAlign: 'right', paddingTop: '10px' }}>Tạm tính:</TableCell>
                  <TableCell style={{ paddingTop: '10px' }}>{(order.total - order.shippingFee).toLocaleString()}đ</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan="3" style={{ textAlign: 'right' }}>Phí vận chuyển:</TableCell>
                  <TableCell>{order.shippingFee.toLocaleString()}đ</TableCell>
                </TableRow>
                <TableRow style={{ fontSize: '16px', fontWeight: 700, color: '#ef4444' }}>
                  <TableCell colSpan="3" style={{ textAlign: 'right' }}>Tổng cộng:</TableCell>
                  <TableCell>{order.total.toLocaleString()}đ</TableCell>
                </TableRow>
              </tfoot>
            </Table>
          </Box>

          {/* Timeline / History (Optional) */}
          <Box sx={adminCardSx}>
            <Typography component="h3" variant="h5" style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Lịch Sử Đơn Hàng</Typography>
            {order.history.map((h, i) => (
              <Box key={i} style={{ marginBottom: '10px', fontSize: '14px' }}>
                <Box component="span" style={{ color: '#888', marginRight: '10px' }}>{h.date}</Box>
                <Box component="span">{h.action}</Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Column: Customer & Actions */}
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Main Actions */}
          <Box sx={adminCardSx}>
            <Typography component="h3" variant="h5" style={{ marginBottom: '15px' }}>Thao Tác</Typography>
            <Box style={{ marginBottom: '15px' }}>
              <Box component="label" style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 600, color: '#555' }}>Trạng Thái Đơn Hàng</Box>
              <Select
                style={{ width: '100%', height: '40px' }}
                value={order.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
              >
                <MenuItem value="Pending">Chờ xác nhận (Pending)</MenuItem>
                <MenuItem value="Processing">Đang xử lý (Processing)</MenuItem>
                <MenuItem value="Shipping">Đang giao (Shipping)</MenuItem>
                <MenuItem value="Completed">Hoàn thành (Completed)</MenuItem>
                <MenuItem value="Cancelled">Đã hủy (Cancelled)</MenuItem>
              </Select>
            </Box>
            <Box style={{ display: 'flex', gap: '10px' }}>
              <Button sx={{ ...primaryButtonSx, flex: 1 }}>In Hóa Đơn</Button>
              <Button sx={{ ...secondaryButtonSx, flex: 1 }}>Gửi Email</Button>
            </Box>
          </Box>

          {/* Customer Info */}
          <Box sx={adminCardSx}>
            <Typography component="h3" variant="h5" style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Thông Tin Khách Hàng</Typography>

            <Box style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Box style={{ width: 40, height: 40, background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                👤
              </Box>
              <Box>
                <Box style={{ fontWeight: 600 }}>{order.customer}</Box>
                <Box style={{ fontSize: '12px', color: '#888' }}>Khách hàng thân thiết</Box>
              </Box>
            </Box>

            <Box style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <Typography component="p" variant="body1">📧 <Box component="a" href={`mailto:${order.email}`}>{order.email}</Box></Typography>
              <Typography component="p" variant="body1">📞 {order.phone}</Typography>
            </Box>
          </Box>

          {/* Shipping Address */}
          <Box sx={adminCardSx}>
            <Typography component="h3" variant="h5" style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Địa Chỉ Giao Hàng</Typography>
            <Typography component="p" variant="body1" style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
              {order.address}
            </Typography>
          </Box>

        </Box>
      </Box>
    </AdminLayout>
  )
}

export default OrderDetail
