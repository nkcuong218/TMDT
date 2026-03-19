package com.pthttmdt.tmdt.dto;

import com.pthttmdt.tmdt.entity.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrderStatusHistoryDto {
    private Long id;
    private OrderStatus status;
    private String note;
    private Long changedById;
    private LocalDateTime createdAt;
}
