import { Box, Typography } from '@mui/material'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'

const PolicySection = () => {
  const policies = [
    {
      id: 1,
      icon: <LocalShippingOutlinedIcon sx={{ width: 40, height: 40 }} />,
      title: 'MIỄN PHÍ GIAO HÀNG ĐƠN TỪ 499K',
      desc: 'Giao hàng nhanh chóng'
    },
    {
      id: 2,
      icon: <AutorenewOutlinedIcon sx={{ width: 40, height: 40 }} />,
      title: 'ĐỔI HÀNG LINH HOẠT',
      desc: 'Trong vòng 15 ngày kể từ ngày mua'
    },
    {
      id: 3,
      icon: <VerifiedOutlinedIcon sx={{ width: 40, height: 40 }} />,
      title: 'BẢO HÀNH SẢN PHẨM',
      desc: 'Trong vòng 6 tháng kể từ ngày mua'
    },
    {
      id: 4,
      icon: <SupportAgentOutlinedIcon sx={{ width: 40, height: 40 }} />,
      title: 'TƯ VẤN NHANH CHÓNG',
      desc: 'Hỗ trợ từ 7h30-23h mỗi ngày'
    }
  ]

  return (
    <Box component="section" sx={{ py: '40px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: '16px' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: { xs: '20px', sm: '30px 15px', md: '30px' } }}>
          {policies.map(item => (
            <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', px: '10px' }}>
              <Box sx={{ mb: '16px', color: 'var(--text-main)', transition: 'transform 0.3s ease' }}>
                {item.icon}
              </Box>
              <Typography component="h3" variant="h5" sx={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', mb: '4px', color: 'var(--text-main)' }}>{item.title}</Typography>
              <Typography component="p" variant="body1" sx={{ fontSize: '12px', color: 'var(--text-light)' }}>{item.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default PolicySection
