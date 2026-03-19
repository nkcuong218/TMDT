import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { Box } from '@mui/material'

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Box component="main">
        {children}
      </Box>
      <Footer />
    </>
  )
}

export default Layout
