package com.tmdt.tmdt.modules.order.dto.response;

import java.util.List;

public record OrderDetailResponse(
        Long id,
        String code,
        String customer,
        String phone,
        String email,
        String date,
        long total,
        String status,
        String paymentMethod,
        long shippingFee,
        String address,
        List<OrderItemResponse> items,
        List<OrderHistoryResponse> history
) {
}
