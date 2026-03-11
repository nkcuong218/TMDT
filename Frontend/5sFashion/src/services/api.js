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

// ============= Auth APIs =============
export function register(payload) {
  return apiRequest("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return apiRequest("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getProfile(userId) {
  return apiRequest(`/api/v1/auth/profile?userId=${userId}`);
}

// ============= Order APIs =============
export function createOrder(payload) {
  return apiRequest("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMyOrders(userId) {
  return apiRequest(`/api/v1/orders/my-orders?userId=${userId}`);
}

export function getAdminOrders(status = "All") {
  return apiRequest(`/api/v1/admin/orders?status=${status}`);
}

export function getAdminOrderDetail(orderId) {
  return apiRequest(`/api/v1/admin/orders/${orderId}`);
}

export function updateOrderStatus(orderId, payload) {
  return apiRequest(`/api/v1/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ============= Admin User APIs =============
export function getAdminCustomers({ keyword = "", status = "All" } = {}) {
  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  if (status !== "All") params.append("status", status);
  return apiRequest(`/api/v1/admin/customers?${params.toString()}`);
}

export function getAdminCustomerDetail(userId) {
  return apiRequest(`/api/v1/admin/customers/${userId}`);
}

export function toggleUserStatus(userId) {
  return apiRequest(`/api/v1/admin/customers/${userId}/status`, {
    method: "PATCH",
  });
}

export default {
  register,
  login,
  getProfile,
  createOrder,
  getMyOrders,
  getAdminOrders,
  getAdminOrderDetail,
  updateOrderStatus,
  getAdminCustomers,
  getAdminCustomerDetail,
  toggleUserStatus,
};
