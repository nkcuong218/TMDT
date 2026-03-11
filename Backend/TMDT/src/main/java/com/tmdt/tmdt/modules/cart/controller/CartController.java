package com.tmdt.tmdt.modules.cart.controller;

import com.tmdt.tmdt.modules.cart.dto.AddCartItemRequest;
import com.tmdt.tmdt.modules.cart.dto.CartResponse;
import com.tmdt.tmdt.modules.cart.dto.UpdateCartItemRequest;
import com.tmdt.tmdt.modules.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@RequestParam Long userId) {
        return ResponseEntity.ok(cartService.getActiveCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@Valid @RequestBody AddCartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(request));
    }

    @PatchMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateItemQuantity(
            @RequestParam Long userId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, itemId, request.quantity()));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(
            @RequestParam Long userId,
            @PathVariable Long itemId
    ) {
        return ResponseEntity.ok(cartService.removeItem(userId, itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<CartResponse> clearCart(@RequestParam Long userId) {
        return ResponseEntity.ok(cartService.clearCart(userId));
    }
}
