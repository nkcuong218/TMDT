package com.tmdt.tmdt.modules.user.dto.response;

import java.util.List;

public record CustomerDetailResponse(
        Long id,
        String name,
        String email,
        String phone,
        String address,
        String joinDate,
        String status,
        Stats stats,
        List<OrderItem> orders
) {
    public record Stats(long totalOrders, long totalSpent, String lastOrderDate) {
    }

    public record OrderItem(Long orderId, String id, String date, long total, String status) {
    }
}
