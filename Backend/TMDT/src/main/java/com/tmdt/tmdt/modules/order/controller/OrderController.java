package com.tmdt.tmdt.modules.order.controller;

import com.tmdt.tmdt.modules.order.dto.request.CreateOrderRequest;
import com.tmdt.tmdt.modules.order.dto.request.UpdateOrderStatusRequest;
import com.tmdt.tmdt.modules.order.dto.response.AdminOrderListItemResponse;
import com.tmdt.tmdt.modules.order.dto.response.CreateOrderResponse;
import com.tmdt.tmdt.modules.order.dto.response.OrderDetailResponse;
import com.tmdt.tmdt.modules.order.dto.response.UserOrderListItemResponse;
import com.tmdt.tmdt.modules.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/v1/orders")
    public ResponseEntity<CreateOrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping("/api/v1/admin/orders")
    public ResponseEntity<List<AdminOrderListItemResponse>> getAdminOrders(
            @RequestParam(defaultValue = "All") String status
    ) {
        return ResponseEntity.ok(orderService.getAdminOrders(status));
    }

    @GetMapping("/api/v1/orders/my-orders")
    public ResponseEntity<List<UserOrderListItemResponse>> getMyOrders(
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(orderService.getMyOrders(userId));
    }

    @GetMapping("/api/v1/admin/orders/{id}")
    public ResponseEntity<OrderDetailResponse> getAdminOrderDetail(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getAdminOrderDetail(id));
    }

    @PatchMapping("/api/v1/admin/orders/{id}/status")
    public ResponseEntity<OrderDetailResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }
}
