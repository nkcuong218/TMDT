package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.dto.OrderDetailDto;
import com.pthttmdt.tmdt.dto.OrderItemDetailDto;
import com.pthttmdt.tmdt.dto.OrderStatusHistoryDto;
import com.pthttmdt.tmdt.entity.Order;
import com.pthttmdt.tmdt.mapper.OrderMapper;
import com.pthttmdt.tmdt.repository.OrderItemRepository;
import com.pthttmdt.tmdt.repository.OrderRepository;
import com.pthttmdt.tmdt.repository.OrderStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final OrderMapper orderMapper;

    public OrderDetailDto getOrderDetail(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        List<OrderItemDetailDto> items = orderItemRepository.findByOrderId(orderId).stream()
                .map(item -> OrderItemDetailDto.builder()
                        .id(item.getId())
                        .productVariantId(item.getProductVariant() != null ? item.getProductVariant().getId() : null)
                        .productName(item.getProductName())
                        .sku(item.getSku())
                        .color(item.getColor())
                        .size(item.getSize())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build())
                .toList();

        List<OrderStatusHistoryDto> history = orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(orderId).stream()
                .map(h -> OrderStatusHistoryDto.builder()
                        .id(h.getId())
                        .status(h.getStatus())
                        .note(h.getNote())
                        .changedById(h.getChangedBy() != null ? h.getChangedBy().getId() : null)
                        .createdAt(h.getCreatedAt())
                        .build())
                .toList();

        return OrderDetailDto.builder()
                .order(orderMapper.toDto(order))
                .items(items)
                .history(history)
                .build();
    }
}
