import { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { getMyOrders } from '../../services/catalogApi'
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'


const Account = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userId = Number(localStorage.getItem('user_id') || 0)

  useEffect(() => {
    const loadOrders = async () => {
      if (!userId) {
        setError('Vui long dang nhap de xem don hang cua ban.')
        setLoading(false)
        return
      }

      try {
        setError('')
        const data = await getMyOrders(userId)
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Khong the tai lich su don hang.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [userId])

  return (
    <Layout>
      <Box sx={{ py: '40px', backgroundColor: 'var(--bg-body)', minHeight: '80vh' }}>
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: '16px' }}>
          <Box sx={{ background: 'var(--bg-surface)', borderRadius: '8px', p: '30px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
            <Typography component="h2" variant="h4" sx={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', mb: '24px', pb: '16px', borderBottom: '1px solid var(--border-color)' }}>Don Hang Cua Toi</Typography>

            {loading && <Typography component="p" variant="body1">Dang tai du lieu...</Typography>}
            {!loading && error && <Typography component="p" variant="body1" style={{ color: 'red' }}>{error}</Typography>}

            {!loading && !error && orders.length === 0 && (
              <Typography component="p" variant="body1">Ban chua co don hang nao.</Typography>
            )}

            {!loading && !error && orders.length > 0 && (
              <Table sx={{ width: '100%', borderCollapse: 'collapse', '& th': { textAlign: 'left', p: '12px 16px', background: 'var(--bg-muted)', color: 'var(--text-light)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)' }, '& td': { p: '14px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '14px', color: 'var(--text-main)' } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Ma Don</TableCell>
                    <TableCell>Ngay Dat</TableCell>
                    <TableCell>Tong Tien</TableCell>
                    <TableCell>Trang Thai</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.code}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{Number(order.total || 0).toLocaleString()}đ</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default Account
