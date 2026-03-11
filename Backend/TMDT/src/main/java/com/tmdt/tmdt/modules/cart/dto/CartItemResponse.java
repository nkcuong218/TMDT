package com.tmdt.tmdt.modules.cart.dto;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long productId,
        Long productVariantId,
        String productName,
        String image,
        String color,
        String size,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal lineTotal
) {
}
