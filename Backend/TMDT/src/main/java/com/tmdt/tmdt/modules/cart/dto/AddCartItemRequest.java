package com.tmdt.tmdt.modules.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddCartItemRequest(
        @NotNull Long userId,
        @NotNull Long productVariantId,
        @NotNull @Min(1) Integer quantity
) {
}
