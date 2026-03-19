import { Link } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'

const ProductCard = ({ product }) => {
  return (
    <Box sx={{ background: 'var(--bg-surface)', borderRadius: '8px', overflow: 'hidden', position: 'relative', transition: 'all 0.3s ease', border: '1px solid transparent', '&:hover': { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderColor: 'var(--border-color)', transform: 'translateY(-4px)' }, '&:hover img': { transform: 'scale(1.05)' } }}>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <Box sx={{ position: 'relative', width: '100%', pt: '133%', overflow: 'hidden', backgroundColor: 'var(--bg-muted)' }}>
          {product.discount > 0 && (
            <Box sx={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'var(--secondary-color)', color: 'var(--white)', px: '8px', py: '4px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', zIndex: 2 }}>-{product.discount}%</Box>
          )}
          <Box component="img" src={product.image} alt={product.title} loading="lazy" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
        </Box>
      </Link>

      <Box sx={{ p: '16px', textAlign: 'left' }}>
        <Box sx={{ fontSize: '12px', color: 'var(--text-light)', mb: '4px', textTransform: 'uppercase' }}>{product.category}</Box>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <Typography component="h3" variant="h5" title={product.title} sx={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-main)', mb: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '48px' }}>{product.title}</Typography>
        </Link>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '12px' }}>
          <Box component="span" sx={{ fontSize: '18px', fontWeight: 700, color: 'var(--secondary-color)' }}>{product.price.toLocaleString('vi-VN')}đ</Box>
          {product.originalPrice > product.price && (
            <Box component="span" sx={{ fontSize: '14px', color: 'var(--text-light)', textDecoration: 'line-through' }}>{product.originalPrice.toLocaleString('vi-VN')}đ</Box>
          )}
        </Box>

        <Button sx={{ width: '100%', py: '10px', backgroundColor: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', fontWeight: 600, borderRadius: '4px', textTransform: 'none', transition: 'all 0.3s', '&:hover': { backgroundColor: 'var(--primary-color)', color: 'var(--white)' } }}>
              Thêm vào giỏ
        </Button>
      </Box>
    </Box>
  )
}

export default ProductCard
