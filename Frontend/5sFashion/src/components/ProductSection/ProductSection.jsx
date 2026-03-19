import ProductCard from '../ProductCard/ProductCard'
import { Box, Typography } from '@mui/material'

const ProductSection = ({ title, products, link }) => {
  return (
    <Box component="section" sx={{ py: '60px' }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: '16px' }}>
        <Typography component="h2" variant="h4" sx={{ mb: '20px', fontWeight: 700 }}>{title}</Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: '16px' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>

        <Box component="a" href={link } sx={{ backgroundColor: 'whitesmoke', display: 'block', width: 'fit-content', margin: '40px auto 0', padding: '12px 32px', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase', transition: 'all 0.3s', '&:hover': { backgroundColor: 'red', color: 'white' } }}>Xem Tất Cả</Box>
      </Box>
    </Box>
  )
}

export default ProductSection
