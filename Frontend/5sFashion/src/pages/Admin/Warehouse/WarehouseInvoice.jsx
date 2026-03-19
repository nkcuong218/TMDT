import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, primaryButtonSx, secondaryButtonSx } from '../../../components/AdminLayout/AdminLayout'
import { useParams, useNavigate } from 'react-router-dom'
import { getInventoryInvoice } from '../../../services/catalogApi'
import { Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'

const WarehouseInvoice = () => {
  const { id } = useParams() // Should be invoice ID or transaction ID
  const navigate = useNavigate()

  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadInvoice = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getInventoryInvoice(id)
        if (isMounted) {
          setInvoice(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Khong the tai hoa don nhap')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadInvoice()
    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return <AdminLayout>Dang tai hoa don...</AdminLayout>
  }

  if (error || !invoice) {
    return <AdminLayout>{error || 'Khong tim thay hoa don'}</AdminLayout>
  }

  return (
    <AdminLayout title={`Chi Tiết Hóa Đơn Nhập #${invoice.id}`}>
      <Box sx={{ ...adminCardSx, maxWidth: '900px', mx: 'auto' }}>
        {/* Header Actions */}
        <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <Button onClick={() => navigate(-1)} sx={secondaryButtonSx}>
                        ← Quay Lại
          </Button>
          <Button
            sx={primaryButtonSx}
            onClick={() => window.print()}
          >
                        In Hóa Đơn
          </Button>
        </Box>

        {/* Invoice Content */}
        <Box style={{ padding: '40px', border: '1px solid #eee', borderRadius: '8px' }}>
          <Box style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Typography component="h1" variant="h3" style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Hóa Đơn Nhập Kho</Typography>
            <Typography component="p" variant="body1" style={{ color: '#666' }}>Ngày nhập: {invoice.date}</Typography>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <Box>
              <Typography component="h3" variant="h5" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#DA251D' }}>Nhà Cung Cấp</Typography>
              <Typography component="p" variant="body1"><Box component="strong">{invoice.supplier.name}</Box></Typography>
              <Typography component="p" variant="body1">{invoice.supplier.address}</Typography>
              <Typography component="p" variant="body1">SĐT: {invoice.supplier.phone}</Typography>
              <Typography component="p" variant="body1">Email: {invoice.supplier.email}</Typography>
            </Box>
            <Box style={{ textAlign: 'right' }}>
              <Typography component="h3" variant="h5" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>Thông Tin Nhập</Typography>
              <Typography component="p" variant="body1">Mã Phiếu: <Box component="strong">#{invoice.id}</Box></Typography>
              <Typography component="p" variant="body1">Người tạo: {invoice.creator}</Typography>
              <Typography component="p" variant="body1">Ghi chú: {invoice.note}</Typography>
            </Box>
          </Box>

          <Table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <TableHead>
              <TableRow style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                <TableCell style={{ padding: '12px', textAlign: 'left' }}>STT</TableCell>
                <TableCell style={{ padding: '12px', textAlign: 'left' }}>Sản Phẩm</TableCell>
                <TableCell style={{ padding: '12px', textAlign: 'center' }}>ĐVT</TableCell>
                <TableCell style={{ padding: '12px', textAlign: 'right' }}>Số Lượng</TableCell>
                <TableCell style={{ padding: '12px', textAlign: 'right' }}>Đơn Giá</TableCell>
                <TableCell style={{ padding: '12px', textAlign: 'right' }}>Thành Tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <TableCell style={{ padding: '12px' }}>{index + 1}</TableCell>
                  <TableCell style={{ padding: '12px' }}>
                    <Box style={{ fontWeight: '600' }}>{item.name}</Box>
                    <small style={{ color: '#888' }}>SKU: {item.sku}</small>
                  </TableCell>
                  <TableCell style={{ padding: '12px', textAlign: 'center' }}>{item.unit}</TableCell>
                  <TableCell style={{ padding: '12px', textAlign: 'right' }}>{item.quantity}</TableCell>
                  <TableCell style={{ padding: '12px', textAlign: 'right' }}>{item.unitPrice.toLocaleString('vi-VN')}₫</TableCell>
                  <TableCell style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>{item.total.toLocaleString('vi-VN')}₫</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <tfoot>
              <TableRow>
                <TableCell colSpan="5" style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>Tổng Cộng:</TableCell>
                <TableCell style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#DA251D' }}>
                  {invoice.totalAmount.toLocaleString('vi-VN')}₫
                </TableCell>
              </TableRow>
            </tfoot>
          </Table>

          <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
            <Box style={{ textAlign: 'center' }}>
              <Typography component="p" variant="body1" style={{ fontWeight: 'bold', marginBottom: '60px' }}>Người Giao Hàng</Typography>
              <Typography component="p" variant="body1">(Ký, họ tên)</Typography>
            </Box>
            <Box style={{ textAlign: 'center' }}>
              <Typography component="p" variant="body1" style={{ fontWeight: 'bold', marginBottom: '60px' }}>Người Lập Phiếu</Typography>
              <Typography component="p" variant="body1">{invoice.creator}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  )
}

export default WarehouseInvoice
