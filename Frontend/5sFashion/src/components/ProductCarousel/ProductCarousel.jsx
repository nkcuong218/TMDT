import { useState, useRef } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import ProductCard from '../ProductCard/ProductCard'

const ProductCarousel = ({ tabs = [] }) => {
  const [activeTab, setActiveTab] = useState(0)
  const scrollRef = useRef(null)

  const activeProducts = tabs[activeTab]?.products || []

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <Box component="section" sx={{ py: '60px', position: 'relative' }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: '16px' }}>
        
        {/* Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: '40px', gap: '20px' }}>
          {tabs.map((tab, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Typography 
                component="span" 
                onClick={() => setActiveTab(idx)}
                sx={{ 
                  fontSize: '24px', 
                  fontWeight: activeTab === idx ? 700 : 500, 
                  color: activeTab === idx ? 'var(--text-main)' : '#64748b',
                  cursor: 'pointer',
                  transition: 'color 0.3s'
                }}
              >
                {tab.label}
              </Typography>
              {idx < tabs.length - 1 && (
                <Box component="span" sx={{ fontSize: '24px', color: '#cbd5e1', fontWeight: 300 }}>|</Box>
              )}
            </Box>
          ))}
        </Box>

        {/* Carousel Container */}
        <Box sx={{ position: 'relative', '.arrow-btn': { opacity: 0, visibility: 'hidden', transition: 'all 0.3s ease' }, '&:hover .arrow-btn': { opacity: 1, visibility: 'visible' } }}>
          
          {/* Nút lùi */}
          <IconButton 
            className="arrow-btn"
            onClick={() => handleScroll('left')}
            sx={{ 
              position: 'absolute', left: '-20px', top: '40%', transform: 'translateY(-50%)', zIndex: 10,
              backgroundColor: '#111', color: '#fff', '&:hover': { backgroundColor: '#333' }
            }}
          >
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>

          {/* Wrapper chứa danh sách (cuộn ngang) */}
          <Box 
            ref={scrollRef}
            sx={{ 
              display: 'flex', gap: '16px', overflowX: 'auto', scrollBehavior: 'smooth', 
              pb: '20px', pt: '10px',
              px: '5px',
              '::-webkit-scrollbar': { display: 'none' }, // Ẩn scrollbar
              msOverflowStyle: 'none', scrollbarWidth: 'none' 
            }}
          >
            {activeProducts.map(product => (
              <Box key={product.id} sx={{ minWidth: { xs: '80vw', sm: '250px', md: '280px' }, flexShrink: 0 }}>
                <ProductCard product={product} />
              </Box>
            ))}
            {activeProducts.length === 0 && (
              <Box sx={{ textAlign: 'center', width: '100%', py: '40px', color: 'var(--text-light)' }}>
                Không có sản phẩm nào
              </Box>
            )}
          </Box>

          {/* Nút tiến */}
          <IconButton 
            className="arrow-btn"
            onClick={() => handleScroll('right')}
            sx={{ 
              position: 'absolute', right: '-20px', top: '40%', transform: 'translateY(-50%)', zIndex: 10,
              backgroundColor: '#111', color: '#fff', '&:hover': { backgroundColor: '#333' }
            }}
          >
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </Box>

      </Box>
    </Box>
  )
}

export default ProductCarousel
