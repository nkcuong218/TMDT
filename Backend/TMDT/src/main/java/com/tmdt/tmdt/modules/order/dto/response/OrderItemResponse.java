package com.tmdt.tmdt.modules.order.dto.response;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        String name,
        String sku,
        String size,
        String color,
        Integer quantity,
        BigDecimal price
) {
}
