import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, adminTableSx, actionButtonSx, secondaryButtonSx, statusBadgeSx } from '../../../components/AdminLayout/AdminLayout'
import { getAdminCustomerDetail, toggleAdminCustomerStatus } from '../../../services/catalogApi'
import { Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'

const CustomerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCustomer = async () => {
      setError('')
      try {
        const data = await getAdminCustomerDetail(id)
        setCustomer(data)
      } catch (err) {
        setError(err.message || 'Khong the tai chi tiet khach hang')
      }
    }

    loadCustomer()
  }, [id])

  const handleToggleStatus = async () => {
    try {
      await toggleAdminCustomerStatus(id)
      const refreshed = await getAdminCustomerDetail(id)
      setCustomer(refreshed)
    } catch (err) {
      window.alert(err.message || 'Cap nhat trang thai that bai')
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
    case 'Completed': return 'status-success'
    case 'Pending': return 'status-warning'
    case 'Processing': return 'status-warning'
    case 'Cancelled': return 'status-danger'
    default: return ''
    }
  }

  if (!customer) return <AdminLayout>{error || 'Loading...'}</AdminLayout>

  return (
    <AdminLayout title={`Chi Tiết Khách Hàng #${id}`}>
      <Box style={{ marginBottom: '20px' }}>
        <Button
          onClick={() => navigate('/admin/users')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
              ← Quay lại danh sách
        </Button>
      </Box>

      <Box style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>

        {/* Left Column: Profile */}
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Box sx={adminCardSx}>
            <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Box style={{ width: 80, height: 80, background: '#eee', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                      👤
              </Box>
              <Typography component="h3" variant="h5" style={{ marginBottom: '5px' }}>{customer.name}</Typography>
              <Box component="span" style={{
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '12px',
                background: customer.status === 'Active' ? '#d1fae5' : '#fee2e2',
                color: customer.status === 'Active' ? '#065f46' : '#b91c1c'
              }}>
                {customer.status}
              </Box>
            </Box>

            <Box style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px' }}>
              <Box>
                <Box component="label" style={{ color: '#666', fontSize: '12px' }}>Email</Box>
                <Box>{customer.email}</Box>
              </Box>
              <Box>
                <Box component="label" style={{ color: '#666', fontSize: '12px' }}>Số Điện Thoại</Box>
                <Box>{customer.phone}</Box>
              </Box>
              <Box>
                <Box component="label" style={{ color: '#666', fontSize: '12px' }}>Địa Chỉ</Box>
                <Box>{customer.address}</Box>
              </Box>
              <Box>
                <Box component="label" style={{ color: '#666', fontSize: '12px' }}>Ngày Tham Gia</Box>
                <Box>{customer.joinDate}</Box>
              </Box>
            </Box>

            <Box style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              {customer.status === 'Active' ?
                <Button sx={{ ...secondaryButtonSx, width: '100%', color: 'red', borderColor: 'red' }} onClick={handleToggleStatus}>Khoa Tai Khoan</Button> :
                <Button sx={{ ...secondaryButtonSx, width: '100%', color: 'green', borderColor: 'green' }} onClick={handleToggleStatus}>Mo Khoa Tai Khoan</Button>
              }
            </Box>
          </Box>

          <Box sx={adminCardSx}>
            <Typography component="h4" variant="h6" style={{ marginBottom: '15px' }}>Thống Kê</Typography>
            <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Box style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                <Box style={{ fontSize: '12px', color: '#666' }}>Tổng Đơn</Box>
                <Box style={{ fontSize: '18px', fontWeight: 700 }}>{customer.stats.totalOrders}</Box>
              </Box>
              <Box style={{ background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                <Box style={{ fontSize: '12px', color: '#666' }}>Tổng Chi Tiêu</Box>
                <Box style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>{(customer.stats.totalSpent / 1000000).toFixed(1)}M</Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Column: Order History */}
        <Box sx={adminCardSx}>
          <Typography component="h3" variant="h5" style={{ marginBottom: '20px' }}>Lịch Sử Đơn Hàng</Typography>
          <Table sx={adminTableSx}>
            <TableHead>
              <TableRow>
                <TableCell>Mã Đơn</TableCell>
                <TableCell>Ngày Đặt</TableCell>
                <TableCell>Tổng Tiền</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customer.orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total.toLocaleString()}đ</TableCell>
                  <TableCell>
                    <Box component="span" sx={statusBadgeSx(getStatusClass(order.status))}>
                      {order.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button sx={actionButtonSx} onClick={() => navigate(`/admin/orders/${order.orderId}`)}>
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

      </Box>
    </AdminLayout>
  )
}

export default CustomerDetail
