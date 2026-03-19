import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, adminTableSx, formInputSx, primaryButtonSx, statusBadgeSx } from '../../../components/AdminLayout/AdminLayout'
import { getWarehouseItems } from '../../../services/catalogApi'
import { Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem, InputBase } from '@mui/material'

const WarehouseManager = () => {
  const [warehouseItems, setWarehouseItems] = useState([])
  const [keyword, setKeyword] = useState('')
  const [locationCode, setLocationCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadItems = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getWarehouseItems({ keyword: keyword.trim(), locationCode })
      setWarehouseItems(data || [])
    } catch (err) {
      setError(err.message || 'Khong the tai du lieu kho')
      setWarehouseItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadInitialItems = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getWarehouseItems({ keyword: '', locationCode: '' })
        if (isMounted) {
          setWarehouseItems(data || [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Khong the tai du lieu kho')
          setWarehouseItems([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadInitialItems()

    return () => {
      isMounted = false
    }
  }, [])

  const handleSearch = async (event) => {
    event.preventDefault()
    await loadItems()
  }

  return (
    <AdminLayout title="Quản Lý Kho Hàng">
      <Box sx={adminCardSx}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Box component="form" onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <InputBase
              type="text"
              placeholder="Tìm SKU hoặc tên SP..."
              sx={{ ...formInputSx, width: 300 }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Select
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              value={locationCode}
              onChange={(e) => setLocationCode(e.target.value)}
            >
              <MenuItem value="">Tất cả kho</MenuItem>
              <MenuItem value="A1">Kho A - Kệ 1</MenuItem>
              <MenuItem value="A2">Kho A - Kệ 2</MenuItem>
              <MenuItem value="B3">Kho B - Kệ 3</MenuItem>
              <MenuItem value="C1">Kho C - Kệ 1</MenuItem>
            </Select>
            <Button type="submit" sx={{ ...primaryButtonSx, height: 40 }}>Lọc</Button>
          </Box>
          <Link to="/admin/warehouse/import" style={{ height: 40, padding: '0 20px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', textDecoration: 'none', background: '#ef4444', color: '#fff' }}>+ Nhập Kho</Link>
        </Box>

        {error && <Typography component="p" variant="body1" style={{ color: 'red', marginBottom: 12 }}>{error}</Typography>}
        {loading && <Typography component="p" variant="body1" style={{ marginBottom: 12 }}>Dang tai du lieu kho...</Typography>}

        <Table sx={adminTableSx}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên Sản Phẩm</TableCell>
              <TableCell>Biến Thể</TableCell>
              <TableCell>Vị Trí</TableCell>
              <TableCell>Số Lượng</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && warehouseItems.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <Box style={{ fontWeight: 600 }}>{item.name}</Box>
                  <Box style={{ fontSize: '12px', color: '#666' }}>SKU: {item.sku}</Box>
                </TableCell>
                <TableCell>{item.color} - {item.size}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell style={{ fontWeight: 600 }}>{item.quantity}</TableCell>
                <TableCell>
                  {item.quantity < 20 ? (
                    <Box component="span" sx={statusBadgeSx('status-danger')}>Sắp hết</Box>
                  ) : (
                    <Box component="span" sx={statusBadgeSx('status-success')}>Sẵn hàng</Box>
                  )}
                </TableCell>
                <TableCell>
                  <Link to={`/admin/warehouse/history/${item.id}`} style={{ textDecoration: 'none', display: 'inline-block', border: '1px solid var(--border-color)', borderRadius: 4, padding: '6px 12px', fontSize: 13, color: 'var(--text-main)', background: 'var(--bg-surface)' }}>Lịch Sử</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </AdminLayout>
  )
}

export default WarehouseManager
