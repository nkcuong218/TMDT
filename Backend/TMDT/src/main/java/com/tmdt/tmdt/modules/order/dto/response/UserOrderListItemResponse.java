package com.tmdt.tmdt.modules.order.dto.response;

public record UserOrderListItemResponse(
        Long id,
        String code,
        String date,
        long total,
        String status
) {
}
