package com.tmdt.tmdt.modules.order.dto.response;

public record AdminOrderListItemResponse(
        Long id,
        String code,
        String customer,
        String phone,
        String date,
        long total,
        String status
) {
}
