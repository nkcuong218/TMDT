package com.pthttmdt.tmdt.mapper;

import com.pthttmdt.tmdt.dto.OrderDto;
import com.pthttmdt.tmdt.entity.Order;
import com.pthttmdt.tmdt.entity.User;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {
    public OrderDto toDto(Order entity) {
        if (entity == null) {
            return null;
        }

        Long userId = entity.getUser() != null ? entity.getUser().getId() : null;

        return OrderDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .userId(userId)
                .customerName(entity.getCustomerName())
                .customerPhone(entity.getCustomerPhone())
                .customerEmail(entity.getCustomerEmail())
                .shippingAddress(entity.getShippingAddress())
                .note(entity.getNote())
                .paymentMethod(entity.getPaymentMethod())
                .paymentStatus(entity.getPaymentStatus())
                .status(entity.getStatus())
                .shippingFee(entity.getShippingFee())
                .discountAmount(entity.getDiscountAmount())
                .subTotal(entity.getSubTotal())
                .totalAmount(entity.getTotalAmount())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public Order toEntity(OrderDto dto) {
        if (dto == null) {
            return null;
        }

        Order entity = new Order();
        entity.setId(dto.getId());
        entity.setCode(dto.getCode());

        if (dto.getUserId() != null) {
            User user = new User();
            user.setId(dto.getUserId());
            entity.setUser(user);
        }

        entity.setCustomerName(dto.getCustomerName());
        entity.setCustomerPhone(dto.getCustomerPhone());
        entity.setCustomerEmail(dto.getCustomerEmail());
        entity.setShippingAddress(dto.getShippingAddress());
        entity.setNote(dto.getNote());
        entity.setPaymentMethod(dto.getPaymentMethod());
        entity.setPaymentStatus(dto.getPaymentStatus());
        entity.setStatus(dto.getStatus());
        entity.setShippingFee(dto.getShippingFee());
        entity.setDiscountAmount(dto.getDiscountAmount());
        entity.setSubTotal(dto.getSubTotal());
        entity.setTotalAmount(dto.getTotalAmount());
        entity.setCreatedAt(dto.getCreatedAt());
        return entity;
    }
}
