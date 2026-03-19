import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, adminTableSx, actionButtonSx, formInputSx, primaryButtonSx } from '../../../components/AdminLayout/AdminLayout'
import { deleteProduct, formatCurrency, getCategories, getProducts, searchProducts } from '../../../services/catalogApi'
import { Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell, InputBase } from '@mui/material'

const ProductManager = () => {
  const [keyword, setKeyword] = useState('')
  const [products, setProducts] = useState([])
  const [categoryMap, setCategoryMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async (searchValue = '') => {
    try {
      setLoading(true)
      setError('')

      const [categoryData, productPage] = await Promise.all([
        getCategories(),
        searchValue ? searchProducts(searchValue, { page: 0, size: 50 }) : getProducts({ page: 0, size: 50 })
      ])

      const map = (categoryData || []).reduce((acc, item) => {
        acc[item.id] = item.name
        return acc
      }, {})

      setCategoryMap(map)
      setProducts(productPage?.content || [])
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách sản phẩm')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData('')
  }, [])

  const rows = useMemo(() => {
    return products.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.slug,
      category: categoryMap[item.categoryId] || '-',
      price: `${formatCurrency(item.basePrice)}đ`,
      stock: '-'
    }))
  }, [products, categoryMap])

  const onSearch = async (event) => {
    event.preventDefault()
    await loadData(keyword.trim())
  }

  const onDelete = async (id) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa sản phẩm này?')
    if (!confirmed) {
      return
    }

    try {
      await deleteProduct(id)
      await loadData(keyword.trim())
    } catch (err) {
      setError(err.message || 'Xóa sản phẩm thất bại')
    }
  }

  return (
    <AdminLayout title="Quản Lý Sản Phẩm">
      <Box sx={adminCardSx}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Box component="form" onSubmit={onSearch} style={{ display: 'flex', gap: '10px' }}>
            <InputBase
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              sx={{ ...formInputSx, width: 300 }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" sx={primaryButtonSx}>Tìm</Button>
          </Box>
          <Link to="/admin/products/add" style={{ height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', textDecoration: 'none', borderRadius: '4px', background: '#ef4444', color: '#fff' }}>+ Thêm Sản Phẩm</Link>
        </Box>

        {error && <Typography component="p" variant="body1" style={{ color: 'red', marginBottom: 12 }}>{error}</Typography>}
        {loading && <Typography component="p" variant="body1" style={{ marginBottom: 12 }}>Đang tải dữ liệu...</Typography>}

        <Table sx={adminTableSx}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên Sản Phẩm</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Danh Mục</TableCell>
              <TableCell>Giá Bán</TableCell>
              <TableCell>Tồn Kho</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && rows.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>
                  <Box style={{ fontWeight: 600 }}>{p.name}</Box>
                </TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  <Button sx={actionButtonSx}>Sửa</Button>
                  <Button sx={{ ...actionButtonSx, color: 'red' }} onClick={() => onDelete(p.id)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </AdminLayout>
  )
}

export default ProductManager
