import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout/AdminLayout'
import { adminCardSx, adminTableSx, actionButtonSx, statusBadgeSx } from '../../../components/AdminLayout/AdminLayout'
import { getDashboardData } from '../../../services/catalogApi'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
const AdminDashboard = () => {
  const [stats, setStats] = useState([])
  const [salesData, setSalesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getDashboardData()
        if (!isMounted) {
          return
        }
        setStats(data?.stats || [])
        setSalesData(data?.salesData || [])
        setCategoryData(data?.categoryData || [])
        setRecentOrders(data?.recentOrders || [])
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Khong the tai dashboard')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

  const getStatusClass = (status) => {
    switch (status) {
    case 'Completed': return 'status-success'
    case 'Pending': return 'status-warning'
    case 'Processing': return 'status-warning'
    case 'Cancelled': return 'status-danger'
    default: return ''
    }
  }

  return (
    <AdminLayout title="Dashboard">
      {error && <Typography component="p" variant="body1" style={{ color: 'red', marginBottom: 16 }}>{error}</Typography>}
      {loading && <Typography component="p" variant="body1" style={{ marginBottom: 16 }}>Dang tai du lieu dashboard...</Typography>}

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', mb: '30px' }}>
        {stats.map((stat, index) => (
          <Box key={index} sx={{ background: 'var(--bg-surface)', p: '20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, mb: '10px' }}>{stat.label}</Box>
            <Box sx={{ fontSize: '28px', fontWeight: 700, color: '#111' }}>{stat.value}</Box>
            <Box sx={{ fontSize: '13px', mt: '5px', color: stat.isUp ? '#10b981' : '#ef4444' }}>
              {stat.trend} so với tháng trước
            </Box>
          </Box>
        ))}
      </Box>

      {/* Charts Section */}
      <Box style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>

        {/* Revenue Area Chart */}
        <Box sx={{ ...adminCardSx, mb: 0 }}>
          <Typography component="h3" variant="h5" style={{ marginBottom: '20px' }}>Doanh Thu 7 Ngày Qua</Typography>
          <Box style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <RechartsTooltip formatter={(value) => `${value.toLocaleString()}đ`} />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" name="Doanh Thu" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Category Pie Chart */}
        <Box sx={{ ...adminCardSx, mb: 0 }}>
          <Typography component="h3" variant="h5" style={{ marginBottom: '20px' }}>Tỷ Lệ Danh Mục</Typography>
          <Box style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>

      {/* Recent Orders */}
      <Box sx={adminCardSx}>
        <Typography component="h3" variant="h5" style={{ marginBottom: '20px' }}>Đơn Hàng Gần Đây</Typography>
        <Table sx={adminTableSx}>
          <TableHead>
            <TableRow>
              <TableCell>Mã Đơn</TableCell>
              <TableCell>Khách Hàng</TableCell>
              <TableCell>Ngày Đặt</TableCell>
              <TableCell>Tổng Tiền</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell><Box component="b">{order.total}</Box></TableCell>
                <TableCell>
                  <Box component="span" sx={statusBadgeSx(getStatusClass(order.status))}>
                    {order.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Button sx={actionButtonSx}>Xem</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

    </AdminLayout>
  )
}

export default AdminDashboard
