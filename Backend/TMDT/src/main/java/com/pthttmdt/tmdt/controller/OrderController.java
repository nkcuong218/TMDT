package com.pthttmdt.tmdt.controller;

import com.pthttmdt.tmdt.dto.CheckoutRequest;
import com.pthttmdt.tmdt.dto.OrderDetailDto;
import com.pthttmdt.tmdt.dto.OrderDto;
import com.pthttmdt.tmdt.entity.Order;
import com.pthttmdt.tmdt.entity.User;
import com.pthttmdt.tmdt.entity.enums.OrderStatus;
import com.pthttmdt.tmdt.mapper.OrderMapper;
import com.pthttmdt.tmdt.security.CurrentUserService;
import com.pthttmdt.tmdt.service.CheckoutService;
import com.pthttmdt.tmdt.service.OrderDetailService;
import com.pthttmdt.tmdt.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final OrderMapper orderMapper;
    private final CurrentUserService currentUserService;
    private final OrderDetailService orderDetailService;
    private final CheckoutService checkoutService;

    @GetMapping
    public List<OrderDto> getAll(Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        if (!currentUserService.isAdmin(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        return orderService.getAll().stream().map(orderMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public OrderDto getById(@PathVariable Long id, Authentication authentication) {
        try {
            Order order = orderService.getById(id);
            validateOrderAccess(order, authentication);
            return orderMapper.toDto(order);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/{id}/detail")
    public OrderDetailDto getDetailById(@PathVariable Long id, Authentication authentication) {
        try {
            Order order = orderService.getById(id);
            validateOrderAccess(order, authentication);
            return orderDetailService.getOrderDetail(id);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<OrderDto> getByCode(@PathVariable String code, Authentication authentication) {
        return orderService.getByCode(code)
                .map(order -> {
                    validateOrderAccess(order, authentication);
                    return orderMapper.toDto(order);
                })
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public List<OrderDto> getMyOrders(Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        return orderService.getByUserId(currentUser.getId()).stream().map(orderMapper::toDto).toList();
    }

    @GetMapping("/user/{userId}")
    public List<OrderDto> getByUserId(@PathVariable Long userId, Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        if (!currentUserService.isAdmin(currentUser) && !currentUser.getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        return orderService.getByUserId(userId).stream().map(orderMapper::toDto).toList();
    }

    @GetMapping("/status/{status}")
    public List<OrderDto> getByStatus(@PathVariable OrderStatus status, Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        if (!currentUserService.isAdmin(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        return orderService.getByStatus(status).stream().map(orderMapper::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<OrderDto> create(@RequestBody OrderDto dto) {
        Order saved = orderService.save(orderMapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(orderMapper.toDto(saved));
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(@RequestBody CheckoutRequest request, Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        Order order = checkoutService.checkout(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderMapper.toDto(order));
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable Long id, @RequestParam OrderStatus status, Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        if (!currentUserService.isAdmin(currentUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        Order order = orderService.getById(id);
        order.setStatus(status);
        return orderMapper.toDto(orderService.save(order));
    }

    @PutMapping("/{id}")
    public OrderDto update(@PathVariable Long id, @RequestBody OrderDto dto) {
        dto.setId(id);
        Order saved = orderService.save(orderMapper.toEntity(dto));
        return orderMapper.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private void validateOrderAccess(Order order, Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        if (currentUserService.isAdmin(currentUser)) {
            return;
        }

        Long ownerId = order.getUser() != null ? order.getUser().getId() : null;
        if (ownerId == null || !ownerId.equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }
}
