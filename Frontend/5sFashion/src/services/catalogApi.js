const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

const ORDER_STATUS_LABEL = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPING: 'Shipping',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
}

const USER_STATUS_LABEL = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  BLOCKED: 'Blocked'
}

const UI_TO_ORDER_STATUS = {
  Pending: 'PENDING',
  Processing: 'PROCESSING',
  Shipping: 'SHIPPING',
  Completed: 'COMPLETED',
  Cancelled: 'CANCELLED'
}

const UI_TO_USER_STATUS = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Blocked: 'BLOCKED'
}

let categoryMapCache = null

const buildUrl = (path, query) => {
  const trimmedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${API_BASE}${trimmedPath}`, window.location.origin)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = (isJson && (payload.message || payload.error)) || payload || 'Request failed'
    throw new Error(message)
  }

  return payload
}

const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, query, includeAuth = true } = options
  const token = includeAuth ? localStorage.getItem('auth_token') : null

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  })

  if (response.status === 204) {
    return null
  }

  return parseResponse(response)
}

const toPage = (items, page = 0, size = 20) => {
  const safeItems = Array.isArray(items) ? items : []
  const start = page * size
  const end = start + size
  return {
    content: safeItems.slice(start, end),
    number: page,
    size,
    totalElements: safeItems.length,
    totalPages: size > 0 ? Math.ceil(safeItems.length / size) : 1
  }
}

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('vi-VN')
}

const mapOrderStatus = (value) => ORDER_STATUS_LABEL[value] || value || 'Pending'
const mapUserStatus = (value) => USER_STATUS_LABEL[value] || value || 'Active'

const getCategoryMap = async () => {
  if (categoryMapCache) {
    return categoryMapCache
  }

  const categories = await apiRequest('/categories')
  categoryMapCache = (categories || []).reduce((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {})
  return categoryMapCache
}

const toProductModel = (product, fallbackCategoryName = 'San pham') => {
  const image = product.primaryImage || 'https://via.placeholder.com/300x400?text=No+Image'
  const basePrice = Number(product.basePrice || 0)
  const originalPrice = Number(product.originalPrice || basePrice)

  return {
    ...product,
    image,
    images: [image],
    categoryName: product.categoryName || fallbackCategoryName,
    basePrice,
    originalPrice
  }
}

const toOrderListItem = (order) => ({
  id: order.id,
  code: order.code,
  customer: order.customerName || '-',
  phone: order.customerPhone || '-',
  email: order.customerEmail || '-',
  address: order.shippingAddress || '-',
  date: formatDate(order.createdAt),
  total: Number(order.totalAmount || 0),
  shippingFee: Number(order.shippingFee || 0),
  status: mapOrderStatus(order.status),
  items: [],
  history: [
    {
      date: formatDate(order.createdAt),
      action: `Trang thai don: ${mapOrderStatus(order.status)}`
    }
  ]
})

export const formatCurrency = (value) => Number(value || 0).toLocaleString('vi-VN')

export const toProductCardModel = (product, fallbackCategoryName = 'San pham') => {
  const model = toProductModel(product, fallbackCategoryName)
  const discount = model.originalPrice > model.basePrice
    ? Math.round(((model.originalPrice - model.basePrice) / model.originalPrice) * 100)
    : 0

  return {
    id: model.id,
    title: model.name,
    price: model.basePrice,
    originalPrice: model.originalPrice,
    discount,
    image: model.image,
    category: model.categoryName || fallbackCategoryName
  }
}

export const getCategories = async () => {
  const categories = await apiRequest('/categories')
  categoryMapCache = (categories || []).reduce((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {})
  return categories || []
}

export const getCategoryBySlug = async (slug) => {
  try {
    // Ưu tiên gọi API trực tiếp nếu BE đã viết hàm này
    return await apiRequest(`/categories/slug/${slug}`);
  } catch (error) {
    // Fallback: Nếu BE báo lỗi 404 (chưa viết API slug), FE sẽ gọi API lấy toàn bộ 
    // danh mục và tự nhặt ra cái khớp dể chữa cháy.
    const allCategories = await getCategories();
    const found = allCategories.find(c => 
      c.slug === slug || 
      (c.name && c.name.toLowerCase().replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a').replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e').replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i').replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o').replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u').replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y').replace(/đ/gi, 'd').replace(/\s+/g, '-') === slug)
    );
    if (!found) throw new Error('Không tìm thấy danh mục!');
    return found;
  }
}

export const getProducts = async ({ page = 0, size = 20, activeOnly = true } = {}) => {
  const [list, categoryMap] = await Promise.all([
    apiRequest(activeOnly ? '/products/active' : '/products'),
    getCategoryMap()
  ])

  const enriched = (list || []).map((item) => toProductModel(item, categoryMap[item.categoryId] || 'San pham'))
  return toPage(enriched, page, size)
}

export const getProductsByCategory = async (categoryId, { page = 0, size = 20, activeOnly = true } = {}) => {
  const [list, categoryMap] = await Promise.all([
    apiRequest(`/products/category/${categoryId}`, { query: { activeOnly } }),
    getCategoryMap()
  ])

  const enriched = (list || []).map((item) => toProductModel(item, categoryMap[item.categoryId] || 'San pham'))
  return toPage(enriched, page, size)
}

export const searchProducts = async (keyword, { page = 0, size = 20, activeOnly = false } = {}) => {
  const [list, categoryMap] = await Promise.all([
    apiRequest('/products/search', { query: { q: keyword, activeOnly } }),
    getCategoryMap()
  ])

  const enriched = (list || []).map((item) => toProductModel(item, categoryMap[item.categoryId] || 'San pham'))
  return toPage(enriched, page, size)
}

export const getProductById = async (id) => {
  const [product, categoryMap] = await Promise.all([
    apiRequest(`/products/${id}`),
    getCategoryMap()
  ])

  return toProductModel(product, categoryMap[product.categoryId] || 'San pham')
}

export const createProduct = (payload) => apiRequest('/products', { method: 'POST', body: payload })
export const deleteProduct = (id) => apiRequest(`/products/${id}`, { method: 'DELETE' })

export const getVariantsByProductId = async (productId) => {
  const variants = await apiRequest(`/product-variants/product/${productId}`)
  return (variants || []).map((item) => ({
    ...item,
    price: item.priceOverride != null ? Number(item.priceOverride) : undefined
  }))
}

const getAllVariants = () => apiRequest('/product-variants')

export const addToCart = async ({ userId, productVariantId, quantity }) => {
  const effectiveUserId = Number(userId || localStorage.getItem('user_id') || 0)
  if (!effectiveUserId) {
    throw new Error('Vui long dang nhap')
  }

  try {
    const existing = await apiRequest(`/cart-items/user/${effectiveUserId}/variant/${productVariantId}`)
    return apiRequest(`/cart-items/${existing.id}`, {
      method: 'PUT',
      body: {
        id: existing.id,
        userId: effectiveUserId,
        productVariantId,
        quantity: Number(existing.quantity || 0) + Number(quantity || 1)
      }
    })
  } catch {
    return apiRequest('/cart-items', {
      method: 'POST',
      body: {
        userId: effectiveUserId,
        productVariantId,
        quantity: Number(quantity || 1)
      }
    })
  }
}

export const updateCartItem = async (_userId, cartItemId, quantity) => {
  const current = await apiRequest(`/cart-items/${cartItemId}`)
  return apiRequest(`/cart-items/${cartItemId}`, {
    method: 'PUT',
    body: {
      ...current,
      quantity
    }
  })
}

export const removeCartItem = async (_userId, cartItemId) => {
  await apiRequest(`/cart-items/${cartItemId}`, { method: 'DELETE' })
  return true
}

export const getCart = async (userId) => {
  const effectiveUserId = Number(userId || localStorage.getItem('user_id') || 0)
  if (!effectiveUserId) {
    throw new Error('Vui long dang nhap')
  }

  const [cartItems, variants, products] = await Promise.all([
    apiRequest(`/cart-items/user/${effectiveUserId}`),
    getAllVariants(),
    apiRequest('/products')
  ])

  const variantMap = (variants || []).reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})

  const productMap = (products || []).reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})

  const items = (cartItems || []).map((item) => {
    const variant = variantMap[item.productVariantId] || {}
    const product = productMap[variant.productId] || {}
    const price = Number(variant.priceOverride ?? product.basePrice ?? 0)

    return {
      ...item,
      productId: variant.productId,
      title: product.name || `San pham #${variant.productId || ''}`.trim(),
      image: product.primaryImage || 'https://via.placeholder.com/300x400?text=No+Image',
      color: variant.color || '-',
      size: variant.size || '-',
      price,
      sku: variant.sku || product.slug || ''
    }
  })

  return { userId: effectiveUserId, items }
}

export const toCartItemViewModel = (item) => ({
  id: item.id,
  product_id: item.productId,
  image: item.image,
  title: item.title,
  color: item.color,
  size: item.size,
  price: Number(item.price || 0),
  quantity: Number(item.quantity || 1)
})

export const createOrder = async (payload) => {
  const body = {
    recipientName: payload.fullName,
    recipientPhone: payload.phone,
    streetAddress: payload.streetAddress || payload.address || '',
    city: payload.city || '',
    district: payload.district || '',
    note: payload.note || '',
    paymentMethod: (payload.paymentMethod || 'COD').toUpperCase(),
    voucherCode: payload.voucherCode || null,
    shippingFee: Number(payload.shippingFee || 0),
    saveAsDefaultAddress: Boolean(payload.saveAsDefaultAddress)
  }

  return apiRequest('/checkout', { method: 'POST', body })
}

export const getMyOrders = async () => {
  const list = await apiRequest('/orders/me')
  return (list || []).map((item) => ({
    id: item.id,
    code: item.code,
    date: formatDate(item.createdAt),
    total: Number(item.totalAmount || 0),
    status: mapOrderStatus(item.status)
  }))
}

export const getAdminOrders = async ({ status = 'All' } = {}) => {
  if (status && status !== 'All') {
    const backendStatus = UI_TO_ORDER_STATUS[status] || status.toUpperCase()
    const filtered = await apiRequest(`/orders/status/${backendStatus}`)
    return (filtered || []).map(toOrderListItem)
  }

  const all = await apiRequest('/orders')
  return (all || []).map(toOrderListItem)
}

export const getAdminOrderDetail = async (orderId) => {
  const detail = await apiRequest(`/orders/${orderId}/detail`)
  const order = detail?.order || {}
  return {
    ...toOrderListItem(order),
    items: (detail?.items || []).map((item) => ({
      id: item.id,
      name: item.productName,
      sku: item.sku,
      color: item.color,
      size: item.size,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 0),
      total: Number(item.price || 0) * Number(item.quantity || 0)
    })),
    history: (detail?.history || []).map((h) => ({
      date: formatDate(h.createdAt),
      action: `${h.status}${h.note ? ` - ${h.note}` : ''}`
    }))
  }
}

export const updateAdminOrderStatus = async (orderId, nextStatus) => {
  const status = UI_TO_ORDER_STATUS[nextStatus] || String(nextStatus || '').toUpperCase()
  const updated = await apiRequest(`/orders/${orderId}/status`, {
    method: 'PATCH',
    query: { status }
  })
  return toOrderListItem(updated)
}

export const loginUser = async ({ identifier, password }) => {
  const value = String(identifier || '').trim().toLowerCase()
  if (!value) {
    throw new Error('Vui long nhap email')
  }

  const auth = await apiRequest('/auth/login', {
    method: 'POST',
    includeAuth: false,
    body: {
      email: value,
      password: String(password || '')
    }
  })

  return {
    id: auth.id,
    role: String(auth.role || 'CUSTOMER').toLowerCase(),
    token: auth.token || auth.accessToken || auth.jwt || auth.jwtToken || '',
    name: auth.fullName || auth.name || ''
  }
}

export const registerUser = async ({ firstName, lastName, email, phone, password }) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    includeAuth: false,
    body: {
      email: String(email || '').trim().toLowerCase(),
      password: String(password || ''),
      fullName: `${lastName || ''} ${firstName || ''}`.trim(),
      phone,
      avatarUrl: null
    }
  })
}

export const logoutUser = async () => {
  await apiRequest('/auth/logout', { method: 'POST' })
  return true
}

export const getAdminCustomers = async ({ keyword = '' } = {}) => {
  const [users, orders] = await Promise.all([apiRequest('/users'), apiRequest('/orders')])
  const normalizedKeyword = String(keyword).trim().toLowerCase()

  const orderStatsByUser = (orders || []).reduce((acc, order) => {
    const userId = order.userId
    if (!userId) return acc

    if (!acc[userId]) {
      acc[userId] = { totalOrders: 0, totalSpent: 0 }
    }

    acc[userId].totalOrders += 1
    acc[userId].totalSpent += Number(order.totalAmount || 0)
    return acc
  }, {})

  return (users || [])
    .filter((user) => String(user.role || '').toUpperCase() !== 'ADMIN')
    .map((user) => {
      const stats = orderStatsByUser[user.id] || { totalOrders: 0, totalSpent: 0 }
      return {
        id: user.id,
        name: user.fullName || '-',
        email: user.email || '-',
        phone: user.phone || '-',
        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent,
        status: mapUserStatus(user.status)
      }
    })
    .filter((item) => {
      if (!normalizedKeyword) return true
      return [item.name, item.email, item.phone].some((value) => String(value).toLowerCase().includes(normalizedKeyword))
    })
}

export const toggleAdminCustomerStatus = async (customerId) => {
  const current = await apiRequest(`/users/${customerId}`)
  const currentStatus = mapUserStatus(current.status)
  const nextUiStatus = currentStatus === 'Active' ? 'Blocked' : 'Active'
  const nextStatus = UI_TO_USER_STATUS[nextUiStatus] || 'ACTIVE'

  const payload = {
    ...current,
    status: nextStatus
  }

  const updated = await apiRequest(`/users/${customerId}`, { method: 'PUT', body: payload })
  return {
    ...updated,
    status: mapUserStatus(updated.status)
  }
}

export const getAdminCustomerDetail = async (customerId) => {
  const [user, orders] = await Promise.all([
    apiRequest(`/users/${customerId}`),
    apiRequest(`/orders/user/${customerId}`)
  ])

  const orderRows = (orders || []).map((item) => ({
    id: item.code,
    orderId: item.id,
    date: formatDate(item.createdAt),
    total: Number(item.totalAmount || 0),
    status: mapOrderStatus(item.status)
  }))

  const totalSpent = orderRows.reduce((sum, item) => sum + item.total, 0)

  return {
    id: user.id,
    name: user.fullName || '-',
    email: user.email || '-',
    phone: user.phone || '-',
    address: 'Chua cap nhat',
    joinDate: formatDate(user.createdAt),
    status: mapUserStatus(user.status),
    stats: {
      totalOrders: orderRows.length,
      totalSpent
    },
    orders: orderRows
  }
}

export const getDashboardData = async () => {
  const [users, products, orders, categories] = await Promise.all([
    apiRequest('/users'),
    apiRequest('/products'),
    apiRequest('/orders'),
    apiRequest('/categories')
  ])

  const totalRevenue = (orders || []).reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)
  const activeProducts = (products || []).filter((item) => item.isActive !== false).length
  const customerCount = (users || []).filter((item) => String(item.role || '').toUpperCase() !== 'ADMIN').length

  const stats = [
    { label: 'Doanh thu', value: `${formatCurrency(totalRevenue)}đ`, trend: '+0%', isUp: true },
    { label: 'Don hang', value: (orders || []).length, trend: '+0%', isUp: true },
    { label: 'San pham', value: activeProducts, trend: '+0%', isUp: true },
    { label: 'Khach hang', value: customerCount, trend: '+0%', isUp: true }
  ]

  const today = new Date()
  const salesData = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    const key = date.toISOString().slice(0, 10)

    const revenue = (orders || [])
      .filter((order) => String(order.createdAt || '').slice(0, 10) === key)
      .reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)

    return {
      name: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
      revenue
    }
  })

  const categoryData = (categories || []).map((category) => {
    const count = (products || []).filter((item) => item.categoryId === category.id).length
    return { name: category.name, value: count }
  })

  const recentOrders = (orders || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5)
    .map((item) => ({
      id: item.code,
      customer: item.customerName || '-',
      date: formatDate(item.createdAt),
      total: `${formatCurrency(item.totalAmount)}đ`,
      status: mapOrderStatus(item.status)
    }))

  return { stats, salesData, categoryData, recentOrders }
}

export const getWarehouseItems = async ({ keyword = '', locationCode = '' } = {}) => {
  const [variants, products] = await Promise.all([getAllVariants(), apiRequest('/products')])

  const productMap = (products || []).reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})

  const rows = (variants || []).map((variant) => {
    const product = productMap[variant.productId] || {}
    const location = ['A1', 'A2', 'B3', 'C1'][Number(variant.id || 0) % 4]

    return {
      id: variant.id,
      name: product.name || `San pham #${variant.productId || ''}`.trim(),
      sku: variant.sku || '-',
      color: variant.color || '-',
      size: variant.size || '-',
      location,
      quantity: Number(variant.stock || 0)
    }
  })

  const normalizedKeyword = String(keyword).trim().toLowerCase()
  return rows.filter((item) => {
    const keywordMatched = !normalizedKeyword
      || [item.name, item.sku].some((value) => String(value).toLowerCase().includes(normalizedKeyword))
    const locationMatched = !locationCode || item.location === locationCode
    return keywordMatched && locationMatched
  })
}

export const getWarehouseHistory = async (variantId) => {
  const [variant, products, historyRows] = await Promise.all([
    apiRequest(`/product-variants/${variantId}`),
    apiRequest('/products'),
    apiRequest(`/inventory-transactions/variant/${variantId}/history`)
  ])

  const product = (products || []).find((item) => item.id === variant.productId) || {}

  const history = (historyRows || [])
    .slice(0, 20)
    .map((item) => ({
      id: item.itemId,
      date: formatDate(item.createdAt),
      type: String(item.transactionType || '').toUpperCase() === 'IMPORT' ? 'Nhap' : 'Xuat',
      quantity: Number(item.quantity || 0),
      remaining: null,
      note: item.locationCode || '-',
      user: '-',
      importId: String(item.transactionType || '').toUpperCase() === 'IMPORT' ? item.transactionId : null
    }))

  return {
    product: {
      id: variant.id,
      name: product.name || '-',
      sku: variant.sku || '-',
      color: variant.color || '-',
      size: variant.size || '-',
      currentStock: Number(variant.stock || 0)
    },
    history
  }
}

export const getInventoryInvoice = async (transactionId) => {
  const [transaction, suppliers] = await Promise.all([
    apiRequest(`/inventory-transactions/${transactionId}`),
    apiRequest('/suppliers')
  ])

  const supplier = (suppliers || []).find((item) => item.id === transaction.supplierId)

  return {
    id: transaction.id,
    date: formatDate(transaction.createdAt),
    creator: transaction.createdById ? `User #${transaction.createdById}` : 'He thong',
    note: transaction.storageNote || '-',
    supplier: {
      name: supplier?.name || 'Nha cung cap',
      address: supplier?.address || '-',
      phone: supplier?.phone || '-',
      email: '-'
    },
    items: [
      {
        id: 1,
        name: 'Lo hang tong hop',
        sku: transaction.transactionCode || '-',
        unit: 'SP',
        quantity: 1,
        unitPrice: Number(transaction.totalAmount || 0),
        total: Number(transaction.totalAmount || 0)
      }
    ],
    totalAmount: Number(transaction.totalAmount || 0)
  }
}

export const getInventorySuppliers = async () => {
  const activeSuppliers = await apiRequest('/suppliers/active')
  return activeSuppliers || []
}

export const getInventoryVariantOptions = async () => {
  const [variants, products] = await Promise.all([getAllVariants(), apiRequest('/products')])
  const productMap = (products || []).reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})

  return (variants || []).map((item) => ({
    productVariantId: item.id,
    productName: productMap[item.productId]?.name || `San pham #${item.productId || ''}`.trim(),
    sku: item.sku || '-',
    variantLabel: `${item.color || '-'} / ${item.size || '-'} / Ton: ${item.stock || 0}`
  }))
}

export const createInventoryImport = async (payload) => {
  const totalAmount = (payload.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  )

  const created = await apiRequest('/inventory-transactions', {
    method: 'POST',
    body: {
      transactionCode: `NK-${Date.now()}`,
      type: 'IMPORT',
      supplierId: payload.supplierId,
      source: payload.source,
      qualityStatus: payload.quality,
      storageNote: payload.storageNote,
      totalAmount,
      createdById: Number(localStorage.getItem('user_id') || 0) || null
    }
  })

  return getInventoryInvoice(created.id)
}
