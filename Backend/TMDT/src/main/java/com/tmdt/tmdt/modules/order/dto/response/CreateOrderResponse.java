package com.tmdt.tmdt.modules.order.dto.response;

public record CreateOrderResponse(
        Long id,
        String code,
        long total,
        String status,
        String message
) {
}
