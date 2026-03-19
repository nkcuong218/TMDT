import { useState, useEffect } from 'react'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, adminTableSx, secondaryButtonSx } from '../../../components/AdminLayout/AdminLayout'
import { useParams, useNavigate } from 'react-router-dom'
import { getWarehouseHistory } from '../../../services/catalogApi'
import { Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'

const WarehouseHistory = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadHistory = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getWarehouseHistory(id)
        if (!isMounted) {
          return
        }
        setProduct(response?.product || null)
        setHistory(response?.history || [])
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Khong the tai lich su kho')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadHistory()

    return () => {
      isMounted = false
    }

  }, [id])

  const handleViewInvoice = (item) => {
    if (!item.importId) {
      return
    }
    navigate(`/admin/warehouse/invoice/${item.importId}`)
  }

  if (loading) {
    return <AdminLayout>Dang tai...</AdminLayout>
  }

  if (error) {
    return <AdminLayout>{error}</AdminLayout>
  }

  if (!product) {
    return <AdminLayout>Loading...</AdminLayout>
  }

  return (
    <AdminLayout title="Lịch Sử Kho Hàng">
      <Box sx={adminCardSx}>
        <Box style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography component="h2" variant="h4" style={{ fontSize: '18px', fontWeight: '700', marginBottom: '5px' }}>{product.name}</Typography>
            <Box style={{ color: '#666' }}>
              <Box component="span" style={{ marginRight: '15px' }}>SKU: <Box component="strong">{product.sku}</Box></Box>
              <Box component="span" style={{ marginRight: '15px' }}>Biến thể: <Box component="strong">{product.color} - {product.size}</Box></Box>
              <Box component="span">Tồn hiện tại: <Box component="strong" style={{ color: '#DA251D' }}>{product.currentStock}</Box></Box>
            </Box>
          </Box>
          <Button onClick={() => navigate('/admin/warehouse')} sx={secondaryButtonSx}>
                        Quay Lại
          </Button>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={adminTableSx}>
            <TableHead>
              <TableRow>
                <TableCell>Thời Gian</TableCell>
                <TableCell>Loại Giao Dịch</TableCell>
                <TableCell>Thay Đổi</TableCell>
                <TableCell>Tồn Cuối</TableCell>
                <TableCell>Ghi Chú</TableCell>
                <TableCell>Người Thực Hiện</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Box component="span"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: item.type === 'Nhập' ? '#E3F2FD' : item.type === 'Xuất' ? '#FCE4EC' : '#FFF3E0',
                        color: item.type === 'Nhập' ? '#1976D2' : item.type === 'Xuất' ? '#C2185B' : '#F57C00'
                      }}
                    >
                      {item.type}
                    </Box>
                  </TableCell>
                  <TableCell style={{
                    fontWeight: '600',
                    color: item.quantity > 0 ? '#2E7D32' : '#C62828'
                  }}>
                    {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                  </TableCell>
                  <TableCell style={{ fontWeight: '600' }}>{item.remaining}</TableCell>
                  <TableCell>{item.note}</TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell>
                    {item.type === 'Nhập' && item.importId && (
                      <Button
                        onClick={() => handleViewInvoice(item)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          color: '#1976D2',
                          background: 'transparent',
                          border: '1px solid #1976D2',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                                                Xem Hóa Đơn
                      </Button>
                    )}
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
export default WarehouseHistory
