package com.pthttmdt.tmdt.dto;

import com.pthttmdt.tmdt.entity.enums.OrderStatus;
import com.pthttmdt.tmdt.entity.enums.PaymentMethod;
import com.pthttmdt.tmdt.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {
    private Long id;
    private String code;
    private Long userId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String shippingAddress;
    private String note;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus status;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal subTotal;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
}
