import React, { useState } from 'react'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, formInputSx, primaryButtonSx, secondaryButtonSx } from '../../../components/AdminLayout/AdminLayout'
import { useNavigate } from 'react-router-dom'
import { createInventoryImport, getInventorySuppliers, getInventoryVariantOptions } from '../../../services/catalogApi'
import { Box, Typography, Button, Select, MenuItem, InputBase } from '@mui/material'

const WarehouseImport = () => {
  const navigate = useNavigate()

  const [suppliers, setSuppliers] = useState([])
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    supplierId: '',
    description: {
      source: '',
      quality: '',
      storageNote: ''
    },
    items: [
      { id: 1, productVariantId: '', locationCode: 'A1', quantity: 1, unitPrice: 0 }
    ]
  })

  React.useEffect(() => {
    let isMounted = true

    const loadOptions = async () => {
      try {
        setLoading(true)
        setError('')
        const [supplierData, variantData] = await Promise.all([
          getInventorySuppliers(),
          getInventoryVariantOptions()
        ])

        if (!isMounted) {
          return
        }

        setSuppliers(supplierData || [])
        setVariants(variantData || [])
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Khong the tai du lieu phieu nhap')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadOptions()
    return () => {
      isMounted = false
    }
  }, [])

  const handleDescriptionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      description: {
        ...prev.description,
        [field]: value
      }
    }))
  }

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), productVariantId: '', locationCode: 'A1', quantity: 1, unitPrice: 0 }]
    }))
  }

  const handleRemoveItem = (id) => {
    if (formData.items.length === 1) return
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const handleItemChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }))
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError('')
      const payload = {
        supplierId: Number(formData.supplierId),
        source: formData.description.source,
        quality: formData.description.quality,
        storageNote: formData.description.storageNote,
        items: formData.items.map((item) => ({
          productVariantId: Number(item.productVariantId),
          locationCode: item.locationCode,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      }

      const invoice = await createInventoryImport(payload)
      alert(`Đã tạo phiếu nhập kho thành công! Mã phiếu: ${invoice.id}`)
      navigate('/admin/warehouse')
    } catch (err) {
      setError(err.message || 'Tao phieu nhap that bai')
    }
  }

  return (
    <AdminLayout title="Tạo Phiếu Nhập Kho">
      <Box sx={adminCardSx}>
        <Box component="form" onSubmit={handleSubmit} style={{ maxWidth: '1000px' }}>
          {error && <Typography component="p" variant="body1" style={{ color: 'red', marginBottom: 12 }}>{error}</Typography>}
          {loading && <Typography component="p" variant="body1" style={{ marginBottom: 12 }}>Dang tai du lieu...</Typography>}

          {/* General Info */}
          <Box style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
            <Box>
              <Box component="label" style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Nhà Cung Cấp</Box>
              <Select
                sx={{ ...formInputSx, px: 0, py: 0 }}
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                required
              >
                <MenuItem value="">-- Chọn Nhà Cung Cấp --</MenuItem>
                {suppliers.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </Box>
          </Box>

          <Typography component="h3" variant="h5" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Mô Tả Phiếu Nhập</Typography>
          <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <Box>
              <Box component="label" style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Nguồn Hàng</Box>
              <InputBase
                type="text"
                sx={formInputSx}
                placeholder="VD: Lô hàng từ nhà máy Hà Nội"
                value={formData.description.source}
                onChange={(e) => handleDescriptionChange('source', e.target.value)}
              />
            </Box>
            <Box>
              <Box component="label" style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Tình Trạng Hàng</Box>
              <InputBase
                type="text"
                sx={formInputSx}
                placeholder="VD: Nguyên đai kiện, đủ tem mác"
                value={formData.description.quality}
                onChange={(e) => handleDescriptionChange('quality', e.target.value)}
              />
            </Box>
            <Box>
              <Box component="label" style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Lưu Ý Bảo Quản</Box>
              <InputBase
                type="text"
                sx={formInputSx}
                placeholder="VD: Tránh ẩm, xếp kệ cao"
                value={formData.description.storageNote}
                onChange={(e) => handleDescriptionChange('storageNote', e.target.value)}
              />
            </Box>
          </Box>

          {/* Product List */}
          <Typography component="h3" variant="h5" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Danh Sách Sản Phẩm</Typography>

          {formData.items.map((item) => (
            <Box key={item.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1fr 1fr 1.5fr 0.5fr', gap: '15px', marginBottom: '15px', alignItems: 'end' }}>
              <Box>
                <Box component="label" style={{ fontSize: '12px', color: '#666' }}>Sản Phẩm</Box>
                <Select
                  sx={{ ...formInputSx, px: 0, py: 0 }}
                  value={item.productVariantId}
                  onChange={(e) => handleItemChange(item.id, 'productVariantId', e.target.value)}
                  required
                >
                  <MenuItem value="">Chọn Sản Phẩm</MenuItem>
                  {variants.map(v => <MenuItem key={v.productVariantId} value={v.productVariantId}>{v.productName} ({v.sku})</MenuItem>)}
                </Select>
              </Box>
              <Box>
                <Box component="label" style={{ fontSize: '12px', color: '#666' }}>Biến Thể</Box>
                <InputBase
                  type="text"
                  sx={formInputSx}
                  value={variants.find(v => String(v.productVariantId) === String(item.productVariantId))?.variantLabel || ''}
                  disabled
                />
              </Box>
              <Box>
                <Box component="label" style={{ fontSize: '12px', color: '#666' }}>Vị Trí</Box>
                <Select
                  sx={{ ...formInputSx, px: 0, py: 0 }}
                  value={item.locationCode}
                  onChange={(e) => handleItemChange(item.id, 'locationCode', e.target.value)}
                  required
                >
                  <MenuItem value="A1">Kho A - Kệ 1</MenuItem>
                  <MenuItem value="A2">Kho A - Kệ 2</MenuItem>
                  <MenuItem value="B3">Kho B - Kệ 3</MenuItem>
                  <MenuItem value="C1">Kho C - Kệ 1</MenuItem>
                </Select>
              </Box>
              <Box>
                <Box component="label" style={{ fontSize: '12px', color: '#666' }}>Số Lượng</Box>
                <InputBase
                  type="number"
                  sx={formInputSx}
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  required
                />
              </Box>
              <Box>
                <Box component="label" style={{ fontSize: '12px', color: '#666' }}>Đơn Giá Nhập</Box>
                <InputBase
                  type="number"
                  sx={formInputSx}
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                  required
                />
              </Box>
              <Box style={{ paddingBottom: '5px' }}>
                <Button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  style={{ color: 'red', cursor: 'pointer', fontSize: '18px' }}
                  title="Xóa dòng này"
                >
                                    &times;
                </Button>
              </Box>
            </Box>
          ))}

          <Button
            type="button"
            onClick={handleAddItem}
            style={{ padding: '8px 15px', background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '30px', fontWeight: '500' }}
          >
                        + Thêm Sản Phẩm Khác
          </Button>

          {/* Summary */}
          <Box style={{ borderTop: '1px solid #ddd', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <Box component="span" style={{ fontSize: '16px', fontWeight: '600' }}>Tổng Tiền Nhập:</Box>
            <Box component="span" style={{ fontSize: '24px', fontWeight: '700', color: '#DA251D' }}>{calculateTotal().toLocaleString('vi-VN')}₫</Box>
          </Box>

          {/* Actions */}
          <Box style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            <Button
              type="button"
              onClick={() => navigate('/admin/warehouse')}
              sx={secondaryButtonSx}
            >
                            Hủy Bỏ
            </Button>
            <Button
              type="submit"
              sx={primaryButtonSx}
            >
                            Hoàn Tất Nhập Kho
            </Button>
          </Box>

        </Box>
      </Box>
    </AdminLayout>
  )
}

export default WarehouseImport
