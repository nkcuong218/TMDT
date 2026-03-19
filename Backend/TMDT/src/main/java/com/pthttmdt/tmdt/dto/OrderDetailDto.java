package com.pthttmdt.tmdt.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderDetailDto {
    private OrderDto order;
    private List<OrderItemDetailDto> items;
    private List<OrderStatusHistoryDto> history;
}
