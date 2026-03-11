package com.tmdt.tmdt.modules.user.dto.response;

public record CustomerListItemResponse(
        Long id,
        String name,
        String email,
        String phone,
        long totalOrders,
        long totalSpent,
        String status
) {
}
