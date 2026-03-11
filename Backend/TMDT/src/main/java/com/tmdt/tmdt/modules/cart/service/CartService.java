package com.tmdt.tmdt.modules.cart.service;

import com.tmdt.tmdt.modules.cart.dto.AddCartItemRequest;
import com.tmdt.tmdt.modules.cart.dto.CartResponse;

public interface CartService {
    CartResponse getActiveCart(Long userId);

    CartResponse addItem(AddCartItemRequest request);

    CartResponse updateItemQuantity(Long userId, Long itemId, Integer quantity);

    CartResponse removeItem(Long userId, Long itemId);

    CartResponse clearCart(Long userId);
}
