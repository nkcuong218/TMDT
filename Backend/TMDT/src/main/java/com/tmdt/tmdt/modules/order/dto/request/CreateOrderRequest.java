package com.tmdt.tmdt.modules.order.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CreateOrderRequest(
        @NotNull Long userId,
        @NotBlank String fullName,
        @NotBlank String phone,
        @Email @NotBlank String email,
        @NotBlank String address,
        String note,
        @NotBlank String paymentMethod,
        @DecimalMin("0") BigDecimal shippingFee,
        @DecimalMin("0") BigDecimal discountAmount
) {
}
