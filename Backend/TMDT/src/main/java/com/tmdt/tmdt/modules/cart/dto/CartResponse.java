package com.tmdt.tmdt.modules.cart.dto;

import com.tmdt.tmdt.modules.cart.entity.CartStatus;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        Long cartId,
        Long userId,
        CartStatus status,
        List<CartItemResponse> items,
        Integer totalItems,
        BigDecimal subtotal
) {
}
