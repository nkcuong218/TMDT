package com.pthttmdt.tmdt.controller;

import com.pthttmdt.tmdt.dto.CheckoutRequest;
import com.pthttmdt.tmdt.dto.OrderDto;
import com.pthttmdt.tmdt.entity.Order;
import com.pthttmdt.tmdt.entity.User;
import com.pthttmdt.tmdt.mapper.OrderMapper;
import com.pthttmdt.tmdt.security.CurrentUserService;
import com.pthttmdt.tmdt.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final CurrentUserService currentUserService;
    private final OrderMapper orderMapper;

    @PostMapping
    public ResponseEntity<OrderDto> checkout(@RequestBody CheckoutRequest request,
                                             Authentication authentication) {
        User user = currentUserService.requireCurrentUser(authentication);
        Order order = checkoutService.checkout(user, request);
        return ResponseEntity.ok(orderMapper.toDto(order));
    }
}
