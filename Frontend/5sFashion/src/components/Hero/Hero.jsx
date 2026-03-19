import { useState, useEffect } from 'react'
// Import images
import banner1 from '../../assets/Herobanner1.jpg'
import banner2 from '../../assets/Herobanner2.jpg' // Assuming this exists or similar
import banner3 from '../../assets/Herobanner3.jpg'
import { Box, Typography, Button } from '@mui/material'


const slides = [
  {
    id: 1,
    image: banner1,
    cta: 'Mua Ngay'
  },
  {
    id: 2,
    image: banner3,
    cta: 'Xem Chi Tiết'
  },
  {
    id: 3,
    image: banner2,
    cta: 'Khám Phá'
  }
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box component="section" sx={{ position: 'relative', width: '100%', overflow: 'hidden', height: 'calc(100vh - var(--header-height))', maxHeight: 600 }}>
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url(${slide.image})`
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', color: 'white', maxWidth: 800, p: '20px' }}>
              <Box sx={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', mb: '16px', fontWeight: 600 }}>{slide.subtitle}</Box>
              <Typography component="h1" variant="h3" sx={{ fontSize: { xs: '32px', md: '48px' }, fontWeight: 700, mb: '32px', lineHeight: 1.2 }}>{slide.title}</Typography>
              <Button sx={{ background: '#DA251D', color: '#fff', px: 3, py: 1.25, textTransform: 'none', '&:hover': { background: '#b91c1c' } }}>{slide.cta}</Button>
            </Box>
          </Box>
        </Box>
      ))}

      <Box sx={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 10 }}>
        {slides.map((_, index) => (
          <Box
            key={index}
            sx={{ width: 12, height: 12, borderRadius: '50%', background: index === currentSlide ? 'var(--primary-color)' : '#fff', opacity: index === currentSlide ? 1 : 0.5, cursor: 'pointer', transition: 'all 0.3s', transform: index === currentSlide ? 'scale(1.2)' : 'none' }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </Box>
    </Box>
  )
}

export default Hero
