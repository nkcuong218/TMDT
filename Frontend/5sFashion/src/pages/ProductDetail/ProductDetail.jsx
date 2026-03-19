import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { addToCart, formatCurrency, getProductById, getVariantsByProductId } from '../../services/catalogApi'
import { Box, Typography, Button, InputBase, Stack, Divider } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined'

const colorMap = {
  black: '#111111',
  white: '#f7f7f7',
  red: '#e53935',
  blue: '#1e40af',
  navy: '#1e3a8a',
  green: '#2e7d32',
  yellow: '#fbc02d',
  grey: '#9ca3af',
  beige: '#d6c5a2',
  pink: '#ec4899'
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadDetail = async () => {
      try {
        setLoading(true)
        setError('')
        window.scrollTo(0, 0)

        const [productData, variantData] = await Promise.all([
          getProductById(id),
          getVariantsByProductId(id)
        ])

        if (!isMounted) {
          return
        }

        setProduct(productData)
        setVariants(variantData || [])
        const firstImage = productData?.images?.[0] || 'https://via.placeholder.com/640x800?text=No+Image'
        setSelectedImage(firstImage)
        setSelectedColor(variantData?.[0]?.color || null)
        setSelectedSize(variantData?.[0]?.size || null)
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Không thể tải chi tiết sản phẩm')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDetail()
    return () => {
      isMounted = false
    }
  }, [id])

  const colors = useMemo(
    () => [...new Set(variants.map((item) => item.color).filter(Boolean))],
    [variants]
  )

  const sizes = useMemo(() => {
    const filtered = selectedColor ? variants.filter((item) => item.color === selectedColor) : variants
    return [...new Set(filtered.map((item) => item.size).filter(Boolean))]
  }, [variants, selectedColor])

  const currentVariant = useMemo(() => {
    return (
      variants.find((item) => item.color === selectedColor && item.size === selectedSize) ||
      variants.find((item) => item.color === selectedColor) ||
      variants[0] ||
      null
    )
  }, [variants, selectedColor, selectedSize])

  const handleQuantityChange = (delta) => {
    const maxStock = currentVariant?.stock || 999
    setQuantity((prev) => Math.min(maxStock, Math.max(1, prev + delta)))
  }

  const handleAddToCart = async () => {
    if (!currentVariant?.id) {
      alert('San pham nay chua co bien the de them vao gio')
      return false
    }

    try {
      setAddingToCart(true)
      const userId = Number(localStorage.getItem('user_id') || 1)
      await addToCart({
        userId,
        productVariantId: currentVariant.id,
        quantity
      })
      alert('Da them vao gio hang')
      return true
    } catch (err) {
      alert(err.message || 'Them vao gio hang that bai')
      return false
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    const added = await handleAddToCart()
    if (added) {
      navigate('/cart')
    }
  }

  if (loading) {
    return (
      <Layout>
        <Box sx={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Đang tải...
        </Box>
      </Layout>
    )
  }

  if (error || !product) {
    return (
      <Layout>
        <Box sx={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {error || 'Không tìm thấy sản phẩm'}
        </Box>
      </Layout>
    )
  }

  const currentPrice = Number(currentVariant?.price ?? product.basePrice ?? 0)
  const imageList = product.images?.length ? product.images : ['https://via.placeholder.com/640x800?text=No+Image']

  return (
    <Layout>
      <Box sx={{ backgroundColor: 'var(--bg-body)', pb: '80px', pt: { xs: '12px', md: '20px' } }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: '16px' }}>
          <Box sx={{ fontSize: '14px', color: 'var(--text-light)', mb: '18px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <Link to="/" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Trang chủ</Link>
            <Box component="span" sx={{ color: '#ccc' }}>/</Box>
            <Link to="/" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Sản phẩm</Link>
            <Box component="span" sx={{ color: '#ccc' }}>/</Box>
            <Typography component="span" sx={{ color: 'var(--text-main)' }}>{product.name}</Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: '20px', md: '36px' },
              background: 'var(--bg-surface)',
              p: { xs: '16px', md: '28px' },
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', gap: '12px', flexDirection: { xs: 'column-reverse', md: 'row' } }}>
              <Stack direction={{ xs: 'row', md: 'column' }} spacing={1} sx={{ width: { xs: '100%', md: '84px' }, overflowX: { xs: 'auto', md: 'visible' } }}>
                {imageList.map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    sx={{
                      width: '80px',
                      height: '100px',
                      border: '1px solid',
                      borderColor: selectedImage === img ? '#111' : '#eee',
                      cursor: 'pointer',
                      flexShrink: 0,
                      overflow: 'hidden'
                    }}
                  >
                    <Box component="img" src={img} alt={`Thumb ${idx + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Stack>

              <Box sx={{ flex: 1, minHeight: { xs: '380px', md: '560px' }, border: '1px solid var(--border-color)', bgcolor: 'var(--bg-muted)' }}>
                <Box component="img" src={selectedImage || imageList[0]} alt={product.name} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
            </Box>

            <Box>
              <Typography component="h1" variant="h4" sx={{ fontSize: { xs: '24px', md: '28px' }, fontWeight: 800, mb: '10px', color: '#333', lineHeight: 1.3 }}>
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', gap: { xs: '12px', md: '18px' }, flexWrap: 'wrap', fontSize: '14px', color: '#888', mb: '18px' }}>
                <Box component="span">Mã: <Box component="b" sx={{ color: '#444' }}>{currentVariant?.sku || product.slug}</Box></Box>
                <Box component="span">Tình trạng: <Box component="b" sx={{ color: '#444' }}>{(currentVariant?.stock || 0) > 0 ? 'Còn hàng' : 'Hết hàng'}</Box></Box>
                <Box component="span">Thương hiệu: <Box component="b" sx={{ color: '#444' }}>5S Fashion</Box></Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '10px', mb: '22px', pb: '18px', borderBottom: '1px solid #eee' }}>
                <Typography sx={{ fontSize: { xs: '28px', md: '34px' }, fontWeight: 800, color: 'var(--primary-color)' }}>
                  {formatCurrency(currentPrice)}đ
                </Typography>
              </Box>

              <Box sx={{ mb: '22px' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, mb: '10px', color: 'var(--text-main)' }}>
                  MÀU SẮC: {selectedColor || 'Đang cập nhật'}
                </Typography>
                <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
                  {colors.map((color) => (
                    <Box
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      sx={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                        bgcolor: colorMap[color?.toLowerCase()] || '#666',
                        boxShadow: selectedColor === color ? '0 0 0 2px #fff, 0 0 0 4px #111' : 'none'
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ mb: '22px' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, mb: '10px', color: 'var(--text-main)' }}>
                  KÍCH CỠ: {selectedSize || 'Đang cập nhật'}
                </Typography>
                <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
                  {sizes.map((size) => (
                    <Box
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      sx={{
                        minWidth: '46px',
                        height: '36px',
                        px: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: selectedSize === size ? '#111' : '#ddd',
                        bgcolor: selectedSize === size ? 'var(--text-main)' : 'var(--bg-surface)',
                        color: selectedSize === size ? 'var(--bg-surface)' : 'var(--text-main)',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {size}
                    </Box>
                  ))}
                </Stack>
                <Box sx={{ mt: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}>
                  <StraightenOutlinedIcon sx={{ fontSize: 14 }} />
                  Hướng dẫn chọn size
                </Box>
              </Box>

              <Box sx={{ mb: '26px' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, mb: '10px', color: 'var(--text-main)' }}>SỐ LƯỢNG</Typography>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <Button onClick={() => handleQuantityChange(-1)} sx={{ minWidth: '36px', width: '36px', height: '36px', p: 0, bgcolor: 'var(--bg-muted)', color: 'var(--text-main)' }}>-</Button>
                  <InputBase value={quantity} readOnly sx={{ width: '52px', textAlign: 'center', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', '& input': { textAlign: 'center', fontWeight: 700 } }} />
                  <Button onClick={() => handleQuantityChange(1)} sx={{ minWidth: '36px', width: '36px', height: '36px', p: 0, bgcolor: 'var(--bg-muted)', color: 'var(--text-main)' }}>+</Button>
                </Box>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  sx={{
                    flex: 1,
                    height: '50px',
                    border: '1px solid #111',
                    color: 'var(--text-main)',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '15px',
                    '&:hover': { bgcolor: '#fff1f1', borderColor: '#f09e9e' }
                  }}
                >
                  <ShoppingCartOutlinedIcon sx={{ mr: 1 }} />
                  {addingToCart ? 'ĐANG THÊM...' : 'THÊM VÀO GIỎ'}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  sx={{
                    flex: 1,
                    height: '50px',
                    border: '1px solid var(--primary-color)',
                    color: 'var(--primary-color)',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '15px',
                    '&:hover': { bgcolor: 'var(--primary-color)', color: 'var(--white)' }
                  }}
                >
                  MUA NGAY
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-light)' }}>
                  <LocalShippingOutlinedIcon sx={{ color: 'var(--primary-color)', fontSize: 18 }} />
                  Miễn phí giao hàng đơn từ 500K
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-light)' }}>
                  <AutorenewOutlinedIcon sx={{ color: 'var(--primary-color)', fontSize: 18 }} />
                  Hỗ trợ đổi trả trong 30 ngày
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default ProductDetail
