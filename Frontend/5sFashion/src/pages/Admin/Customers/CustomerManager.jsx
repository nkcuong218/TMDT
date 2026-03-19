import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, adminTableSx, actionButtonSx, formInputSx } from '../../../components/AdminLayout/AdminLayout'
import { getAdminCustomers, toggleAdminCustomerStatus } from '../../../services/catalogApi'
import { Box, Button, Table, TableHead, TableBody, TableRow, TableCell, InputBase } from '@mui/material'

const CustomerManager = () => {
  const navigate = useNavigate()

  const [customers, setCustomers] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getAdminCustomers({ keyword })
        setCustomers(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Khong the tai danh sach khach hang')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(loadCustomers, 250)
    return () => clearTimeout(timer)
  }, [keyword])

  const handleToggleStatus = async (id) => {
    const customer = customers.find(c => c.id === id)
    const newStatus = customer.status === 'Active' ? 'Blocked' : 'Active'
    const action = newStatus === 'Blocked' ? 'Khoa' : 'Mo khoa'

    if (window.confirm(`Ban co chac muon ${action} khach hang ${customer.name}?`)) {
      try {
        const updated = await toggleAdminCustomerStatus(id)
        setCustomers(customers.map(c =>
          c.id === id ? { ...c, status: updated.status } : c
        ))
      } catch (err) {
        window.alert(err.message || 'Cap nhat trang thai that bai')
      }
    }
  }

  return (
    <AdminLayout title="Quản Lý Khách Hàng">
      <Box sx={adminCardSx}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Box style={{ display: 'flex', gap: '10px' }}>
            <InputBase
              type="text"
              placeholder="Tim kiem khach hang..."
              sx={{ ...formInputSx, width: 300 }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Box>
        </Box>

        {error ? <Box style={{ color: '#dc2626', marginBottom: '12px' }}>{error}</Box> : null}
        {loading ? <Box>Dang tai du lieu...</Box> : null}

        <Table sx={adminTableSx}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Họ và Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số Điện Thoại</TableCell>
              <TableCell>Đơn Hàng</TableCell>
              <TableCell>Tổng Chi</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>
                  <Box style={{ fontWeight: 600 }}>{c.name}</Box>
                </TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.totalOrders}</TableCell>
                <TableCell>{c.totalSpent.toLocaleString()}đ</TableCell>
                <TableCell>
                  <Box component="span" style={{
                    padding: '4px 10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    background: c.status === 'Active' ? '#d1fae5' : '#fee2e2',
                    color: c.status === 'Active' ? '#065f46' : '#b91c1c'
                  }}>
                    {c.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Button sx={actionButtonSx} onClick={() => navigate(`/admin/users/${c.id}`)}>
                                        Xem
                  </Button>
                  {c.status === 'Active' ? (
                    <Button sx={{ ...actionButtonSx, color: 'red' }} onClick={() => handleToggleStatus(c.id)}>Khoa</Button>
                  ) : (
                    <Button sx={{ ...actionButtonSx, color: 'green' }} onClick={() => handleToggleStatus(c.id)}>Mo</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </AdminLayout>
  )
}

export default CustomerManager
