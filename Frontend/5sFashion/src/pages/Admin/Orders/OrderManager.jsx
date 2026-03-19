import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, adminTableSx, actionButtonSx, statusBadgeSx } from '../../../components/AdminLayout/AdminLayout'
import { getAdminOrders } from '../../../services/catalogApi'
import { Box, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'

const OrderManager = () => {
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState('All')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getAdminOrders({ status: filterStatus })
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Khong the tai danh sach don hang')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [filterStatus])

  const getStatusClass = (status) => {
    switch (status) {
    case 'Completed': return 'status-success'
    case 'Pending': return 'status-warning'
    case 'Processing': return 'status-warning'
    case 'Shipping': return 'status-warning'
    case 'Cancelled': return 'status-danger'
    default: return ''
    }
  }

  return (
    <AdminLayout title="Quản Lý Đơn Hàng">
      <Box sx={adminCardSx}>

        {/* Filters */}
        <Box style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          {['All', 'Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'].map(status => (
            <Button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: filterStatus === status ? '#ef4444' : 'transparent',
                color: filterStatus === status ? 'white' : '#555',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {status === 'All' ? 'Tất cả' : status}
            </Button>
          ))}
        </Box>

        <Table sx={adminTableSx}>
          <TableHead>
            <TableRow>
              <TableCell>Mã Đơn</TableCell>
              <TableCell>Khách Hàng</TableCell>
              <TableCell>SĐT</TableCell>
              <TableCell>Ngày Đặt</TableCell>
              <TableCell>Tổng Tiền</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan="7">Dang tai du lieu...</TableCell>
              </TableRow>
            )}
            {!loading && error && (
              <TableRow>
                <TableCell colSpan="7" style={{ color: 'red' }}>{error}</TableCell>
              </TableRow>
            )}
            {!loading && !error && orders.length === 0 && (
              <TableRow>
                <TableCell colSpan="7">Khong co don hang nao</TableCell>
              </TableRow>
            )}
            {!loading && !error && orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>#{order.code}</TableCell>
                <TableCell>
                  <Box style={{ fontWeight: 600 }}>{order.customer}</Box>
                </TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{Number(order.total || 0).toLocaleString()}đ</TableCell>
                <TableCell>
                  <Box component="span" sx={statusBadgeSx(getStatusClass(order.status))}>
                    {order.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    sx={actionButtonSx}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                                        Xem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </AdminLayout>
  )
}

export default OrderManager
