import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import ProductCard from '../../components/ProductCard/ProductCard'
import {
  getCategoryBySlug,
  getProducts,
  getProductsByCategory,
  toProductCardModel
} from '../../services/catalogApi'
import bannerMen from '../../assets/Herobanner1.jpg'
import bannerWomen from '../../assets/Herobanner2.jpg'
import bannerKids from '../../assets/Herobanner3.jpg'
import { Box, Typography, Select, MenuItem, Checkbox } from '@mui/material'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import SortOutlinedIcon from '@mui/icons-material/SortOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'


const CATEGORY_CONFIG = {
  nam: { title: 'THOI TRANG NAM', banner: bannerMen },
  nu: { title: 'THOI TRANG NU', banner: bannerWomen },
  'be-trai': { title: 'THOI TRANG BE TRAI', banner: bannerKids },
  'be-gai': { title: 'THOI TRANG BE GAI', banner: bannerWomen },
  default: { title: 'SAN PHAM', banner: bannerMen }
}

const CategoryPage = () => {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [categoryName, setCategoryName] = useState(CATEGORY_CONFIG.default.title)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortValue, setSortValue] = useState('Moi nhat')

  const config = useMemo(() => CATEGORY_CONFIG[slug] || CATEGORY_CONFIG.default, [slug])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        setLoading(true)
        setError('')
        window.scrollTo(0, 0)

        if (slug === 'all') {
          const page = await getProducts({ page: 0, size: 40 })
          if (!isMounted) {
            return
          }
          setCategoryName('TAT CA SAN PHAM')
          setProducts(page?.content || [])
          return
        }

        const category = await getCategoryBySlug(slug)
        if (!isMounted) {
          return
        }
        setCategoryName(category?.name || config.title)

        const page = await getProductsByCategory(category.id, { page: 0, size: 40 })
        if (isMounted) {
          setProducts(page?.content || [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Khong the tai du lieu danh muc')
          setProducts([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [slug, config.title])

  const cardProducts = useMemo(
    () => products.map((product) => toProductCardModel(product, categoryName)),
    [products, categoryName]
  )

  return (
    <Layout>
      <Box sx={{ pb: '60px', backgroundColor: 'var(--bg-body)' }}>
        <Box
          sx={{
            height: { xs: 160, md: 220 },
            backgroundImage: `url(${config.banner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            mb: '30px',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.35)'
            }
          }}
        >
          <Typography component="h1" variant="h3" sx={{ zIndex: 1, fontSize: { xs: '26px', md: '36px' }, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            {categoryName}
          </Typography>
        </Box>

        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: '16px' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '30px' }}>
            <Box
              component="aside"
              sx={{
                width: { xs: '100%', md: 260 },
                flexShrink: 0,
                background: 'var(--bg-surface)',
                p: '20px',
                borderRadius: '8px',
                height: 'fit-content',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700, mb: '20px', pb: '10px', borderBottom: '2px solid #111', textTransform: 'uppercase' }}>
                <FilterAltOutlinedIcon fontSize="small" />
                BỘ LỌC TÌM KIẾM
              </Box>

              <Box sx={{ mb: '25px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, mb: '12px' }}>
                  <StraightenOutlinedIcon sx={{ fontSize: 18 }} />
                  SIZE
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                    <Box
                      key={size}
                      sx={{
                        height: '32px',
                        border: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all .2s',
                        '&:hover': { borderColor: '#111', background: '#111', color: 'white' }
                      }}
                    >
                      {size}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: '25px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, mb: '12px' }}>
                  <PaletteOutlinedIcon sx={{ fontSize: 18 }} />
                  MÀU SẮC
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {['black', 'white', 'navy', 'grey', 'red', 'beige'].map((color) => (
                    <Box
                      key={color}
                      sx={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                        background: color,
                        boxShadow: color === 'white' ? 'inset 0 0 0 1px #ccc' : 'none'
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: '10px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, mb: '12px' }}>
                  <SellOutlinedIcon sx={{ fontSize: 18 }} />
                  GIÁ
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Dưới 200k', '200k - 500k', 'Trên 500k'].map((range) => (
                    <Box key={range} component="label" sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-main)', cursor: 'pointer' }}>
                      <Checkbox sx={{ p: 0.5 }} />
                      {range}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box component="main" sx={{ flex: 1 }}>
              <Box
                sx={{
                  background: 'var(--bg-surface)',
                  p: '15px 20px',
                  mb: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '8px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <Box component="span" sx={{ fontSize: '14px' }}>
                  Hiển thị <Box component="b">{cardProducts.length}</Box> sản phẩm
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 220 }}>
                  <SortOutlinedIcon sx={{ fontSize: 18, color: '#555' }} />
                  <Typography component="span" sx={{ fontSize: '14px' }}>Sắp xếp:</Typography>
                  <Select
                    size="small"
                    value={sortValue}
                    onChange={(e) => setSortValue(e.target.value)}
                    sx={{ minWidth: 170, fontSize: '14px' }}
                  >
                    <MenuItem value="Moi nhat">Mới nhất</MenuItem>
                    <MenuItem value="Ban chay">Bán chạy</MenuItem>
                    <MenuItem value="Gia thap den cao">Giá thấp đến cao</MenuItem>
                    <MenuItem value="Gia cao den thap">Giá cao đến thấp</MenuItem>
                  </Select>
                </Box>
              </Box>

              {loading && <Box sx={{ textAlign: 'center', p: '40px', color: 'var(--text-light)' }}>Đang tải sản phẩm...</Box>}

              {!loading && error && (
                <Box sx={{ textAlign: 'center', p: '40px', color: 'var(--text-light)' }}>
                  <Typography component="p" variant="body1">{error}</Typography>
                </Box>
              )}

              {!loading && !error && cardProducts.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)'
                    },
                    gap: { xs: '12px', md: '20px' }
                  }}
                >
                  {cardProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Box>
              )}

              {!loading && !error && cardProducts.length === 0 && (
                <Box sx={{ textAlign: 'center', p: '40px', color: 'var(--text-light)' }}>
                  <Typography component="p" variant="body1">Đang cập nhật sản phẩm cho danh mục này...</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default CategoryPage
