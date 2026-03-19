import React, { useState } from 'react'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, formInputSx, primaryButtonSx, secondaryButtonSx } from '../../../components/AdminLayout/AdminLayout'
import { useNavigate } from 'react-router-dom'
import { createProduct, getCategories } from '../../../services/catalogApi'
import { Box, Typography, Button, Select, MenuItem, InputBase } from '@mui/material'

const AddProduct = () => {
  const navigate = useNavigate()
  const [sizeInput, setSizeInput] = useState('')
  const [colorInput, setColorInput] = useState('')
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    stock: 0,
    colors: [],
    sizes: [],
    descriptionDetails: {
      highlights: '',
      material: '',
      fit: '',
      careInstructions: ''
    },
    image: null
  })

  React.useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const data = await getCategories()
        if (!isMounted) {
          return
        }

        setCategories(data || [])
        if (data?.length) {
          setFormData((prev) => ({ ...prev, categoryId: String(data[0].id) }))
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Không thể tải danh mục')
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false)
        }
      }
    }

    loadCategories()
    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    // Handle image file selection (mock for now)
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }))
    }
  }

  const handleDescriptionDetailChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      descriptionDetails: {
        ...prev.descriptionDetails,
        [field]: value
      }
    }))
  }

  const addTag = (field, value) => {
    const normalizedValue = value.trim()
    if (!normalizedValue) return

    setFormData(prev => {
      if (prev[field].includes(normalizedValue)) return prev

      return {
        ...prev,
        [field]: [...prev[field], normalizedValue]
      }
    })
  }

  const removeTag = (field, tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagKeyDown = (e, field, inputValue, clearInput) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(field, inputValue)
      clearInput('')
    }
  }

  const slugify = (value) => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const cleanSlug = slugify(formData.name || formData.sku || 'san-pham')
      const payload = {
        name: formData.name,
        slug: `${cleanSlug}-${Date.now()}`,
        skuRoot: formData.sku,
        categoryId: Number(formData.categoryId),
        brand: '5S Fashion',
        basePrice: Number(formData.price || 0),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price || 0),
        descriptionHighlights: formData.descriptionDetails.highlights,
        descriptionMaterial: formData.descriptionDetails.material,
        descriptionFit: formData.descriptionDetails.fit,
        descriptionCare: formData.descriptionDetails.careInstructions
      }

      await createProduct(payload)
      alert('Đã thêm sản phẩm thành công!')
      navigate('/admin/products')
    } catch (err) {
      setError(err.message || 'Tạo sản phẩm thất bại')
    }
  }

  return (
    <AdminLayout title="Thêm Sản Phẩm Mới">
      <Box sx={adminCardSx}>
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
          {error && <Typography component="p" variant="body1" style={{ color: 'red' }}>{error}</Typography>}

          <Box sx={{ mb: '15px' }}>
            <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Tên Sản Phẩm</Box>
            <InputBase
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={formInputSx}
              required
              placeholder="Nhập tên sản phẩm"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', mb: '15px' }}>
            <Box sx={{ mb: '15px' }}>
              <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Mã SKU</Box>
              <InputBase
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                sx={formInputSx}
                required
                placeholder="VD: AKG123"
              />
            </Box>
            <Box sx={{ mb: '15px' }}>
              <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Danh Mục</Box>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                sx={{ ...formInputSx, px: 0, py: 0 }}
                disabled={loadingCategories}
              >
                {!loadingCategories && categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', mb: '15px' }}>
            <Box sx={{ mb: '15px' }}>
              <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Giá Bán (VNĐ)</Box>
              <InputBase
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                sx={formInputSx}
                required
                placeholder="0"
              />
            </Box>
            <Box sx={{ mb: '15px' }}>
              <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Giá Niêm Yết (VNĐ)</Box>
              <InputBase
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                sx={formInputSx}
                placeholder="0"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', mb: '15px' }}>
            <Box sx={{ mb: '15px' }}>
              <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Kích Cỡ</Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {formData.sizes.map(size => (
                    <Box component="span" key={size} sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', px: '10px', py: '4px', border: '1px solid var(--border-color)', borderRadius: '999px', background: 'var(--bg-muted)', fontSize: '13px' }}>
                      {size}
                      <Button type="button" onClick={() => removeTag('sizes', size)}>&times;</Button>
                    </Box>
                  ))}
                </Box>
                <InputBase
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyDown={(e) => handleTagKeyDown(e, 'sizes', sizeInput, setSizeInput)}
                  onBlur={() => {
                    addTag('sizes', sizeInput)
                    setSizeInput('')
                  }}
                  sx={formInputSx}
                  placeholder="Nhập size rồi nhấn Enter (VD: S, M, L)"
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', mb: '15px' }}>
            <Box sx={{ mb: '15px' }}>
              <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Màu Sắc</Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {formData.colors.map(color => (
                    <Box component="span" key={color} sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', px: '10px', py: '4px', border: '1px solid var(--border-color)', borderRadius: '999px', background: 'var(--bg-muted)', fontSize: '13px' }}>
                      {color}
                      <Button type="button" onClick={() => removeTag('colors', color)}>&times;</Button>
                    </Box>
                  ))}
                </Box>
                <InputBase
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => handleTagKeyDown(e, 'colors', colorInput, setColorInput)}
                  onBlur={() => {
                    addTag('colors', colorInput)
                    setColorInput('')
                  }}
                  sx={formInputSx}
                  placeholder="Nhập màu rồi nhấn Enter (VD: Đen, Trắng)"
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: '15px' }}>
            <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Hình Ảnh Sản Phẩm</Box>
            <InputBase
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              sx={{ width: '100%', p: '8px' }}
            />
            {formData.image && (
              <Box sx={{ mt: '10px' }}>
                <Typography component="p" variant="body1">Đã chọn: {formData.image.name}</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ mb: '20px' }}>
            <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Mô Tả Chi Tiết</Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', mb: '15px' }}>
              <Box sx={{ mb: '15px' }}>
                <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Điểm Nổi Bật</Box>
                <Box component="textarea"
                  value={formData.descriptionDetails.highlights}
                  onChange={(e) => handleDescriptionDetailChange('highlights', e.target.value)}
                  rows="3"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  placeholder="VD: Chống nhăn, thoáng khí, dễ phối đồ"
                ></Box>
              </Box>
              <Box sx={{ mb: '15px' }}>
                <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Chất Liệu</Box>
                <Box component="textarea"
                  value={formData.descriptionDetails.material}
                  onChange={(e) => handleDescriptionDetailChange('material', e.target.value)}
                  rows="3"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  placeholder="VD: 95% Cotton, 5% Spandex"
                ></Box>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', mb: '15px' }}>
              <Box sx={{ mb: '15px' }}>
                <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Form Dáng</Box>
                <Box component="textarea"
                  value={formData.descriptionDetails.fit}
                  onChange={(e) => handleDescriptionDetailChange('fit', e.target.value)}
                  rows="3"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  placeholder="VD: Regular fit, tôn dáng vai"
                ></Box>
              </Box>
              <Box sx={{ mb: '15px' }}>
                <Box component="label" sx={{ display: 'block', mb: '5px', fontWeight: 600 }}>Hướng Dẫn Bảo Quản</Box>
                <Box component="textarea"
                  value={formData.descriptionDetails.careInstructions}
                  onChange={(e) => handleDescriptionDetailChange('careInstructions', e.target.value)}
                  rows="3"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  placeholder="VD: Giặt máy chế độ nhẹ, không sấy nhiệt cao"
                ></Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button
              type="button"
              onClick={() => navigate('/admin/products')}
              sx={secondaryButtonSx}
            >
                            Hủy Bỏ
            </Button>
            <Button
              type="submit"
              sx={primaryButtonSx}
            >
                            Lưu Sản Phẩm
            </Button>
          </Box>

        </Box>
      </Box>
    </AdminLayout>
  )
}

export default AddProduct
