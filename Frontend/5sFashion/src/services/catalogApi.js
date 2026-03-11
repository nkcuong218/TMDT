const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "API request failed";
    try {
      const data = await response.json();
      message = data?.message || data?.error || message;
    } catch {
      // Keep default message when body is not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getCategories() {
  return apiRequest("/api/v1/categories");
}

export function getCategoryBySlug(slug) {
  return apiRequest(`/api/v1/categories/slug/${encodeURIComponent(slug)}`);
}

export function getProducts({ page = 0, size = 20 } = {}) {
  return apiRequest(`/api/v1/products?page=${page}&size=${size}`);
}

export function getProductsByCategory(categoryId, { page = 0, size = 20 } = {}) {
  return apiRequest(`/api/v1/products/category/${categoryId}?page=${page}&size=${size}`);
}

export function searchProducts(keyword, { page = 0, size = 20 } = {}) {
  return apiRequest(`/api/v1/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
}

export function getProductById(productId) {
  return apiRequest(`/api/v1/products/${productId}`);
}

export function getVariantsByProductId(productId) {
  return apiRequest(`/api/v1/products/${productId}/variants`);
}

export function createProduct(payload) {
  return apiRequest("/api/v1/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(productId) {
  return apiRequest(`/api/v1/products/${productId}`, {
    method: "DELETE",
  });
}

export function getCart(userId) {
  return apiRequest(`/api/v1/cart?userId=${userId}`);
}

export function addToCart(payload) {
  return apiRequest("/api/v1/cart/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCartItem(userId, itemId, quantity) {
  return apiRequest(`/api/v1/cart/items/${itemId}?userId=${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(userId, itemId) {
  return apiRequest(`/api/v1/cart/items/${itemId}?userId=${userId}`, {
    method: "DELETE",
  });
}

export function getDashboardData() {
  return apiRequest("/api/v1/admin/dashboard");
}

export function getWarehouseItems({ keyword = "", locationCode = "" } = {}) {
  const query = new URLSearchParams();
  if (keyword) {
    query.set("keyword", keyword);
  }
  if (locationCode) {
    query.set("locationCode", locationCode);
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiRequest(`/api/v1/inventory/items${suffix}`);
}

export function getWarehouseHistory(inventoryId) {
  return apiRequest(`/api/v1/inventory/items/${inventoryId}/history`);
}

export function getInventoryInvoice(importCode) {
  return apiRequest(`/api/v1/inventory/imports/${encodeURIComponent(importCode)}`);
}

export function createInventoryImport(payload) {
  return apiRequest("/api/v1/inventory/imports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getInventorySuppliers() {
  return apiRequest("/api/v1/inventory/suppliers");
}

export function getInventoryVariantOptions() {
  return apiRequest("/api/v1/inventory/variant-options");
}

export function registerUser(payload) {
  return apiRequest("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return apiRequest("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getUserProfile(userId) {
  return apiRequest(`/api/v1/auth/profile?userId=${userId}`);
}

export function getAdminCustomers({ keyword = "" } = {}) {
  const query = new URLSearchParams();
  if (keyword) {
    query.set("keyword", keyword);
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiRequest(`/api/v1/admin/customers${suffix}`);
}

export function getAdminCustomerDetail(customerId) {
  return apiRequest(`/api/v1/admin/customers/${customerId}`);
}

export function toggleAdminCustomerStatus(customerId) {
  return apiRequest(`/api/v1/admin/customers/${customerId}/status`, {
    method: "PATCH",
  });
}

export function createOrder(payload) {
  return apiRequest("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAdminOrders({ status = "All" } = {}) {
  const query = new URLSearchParams();
  if (status && status !== "All") {
    query.set("status", status);
  }
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiRequest(`/api/v1/admin/orders${suffix}`);
}

export function getAdminOrderDetail(orderId) {
  return apiRequest(`/api/v1/admin/orders/${orderId}`);
}

export function updateAdminOrderStatus(orderId, status) {
  return apiRequest(`/api/v1/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getMyOrders(userId) {
  return apiRequest(`/api/v1/orders/my-orders?userId=${userId}`);
}

export function toCartItemViewModel(item) {
  return {
    id: item.id,
    product_id: item.productId,
    productVariantId: item.productVariantId,
    title: item.productName,
    image: item.image || "https://via.placeholder.com/220x260?text=No+Image",
    color: item.color || "-",
    size: item.size || "-",
    price: Number(item.unitPrice || 0),
    quantity: Number(item.quantity || 0),
  };
}

export function toProductCardModel(product, categoryName = "Sản phẩm") {
  const price = Number(product?.basePrice || 0);
  return {
    id: product?.id,
    title: product?.name || "",
    price,
    originalPrice: price,
    discount: 0,
    image: product?.images?.[0] || "https://via.placeholder.com/640x800?text=No+Image",
    category: categoryName,
  };
}

export function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN");
}
