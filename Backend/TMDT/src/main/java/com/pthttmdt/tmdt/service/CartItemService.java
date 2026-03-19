package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.entity.CartItem;
import com.pthttmdt.tmdt.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartItemService {
    private final CartItemRepository cartItemRepository;

    public List<CartItem> getAll() {
        return cartItemRepository.findAll();
    }

    public CartItem getById(Long id) {
        return cartItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found with id: " + id));
    }

    public List<CartItem> getByUserId(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public Optional<CartItem> getByUserIdAndVariantId(Long userId, Long productVariantId) {
        return cartItemRepository.findByUserIdAndProductVariantId(userId, productVariantId);
    }

    public CartItem save(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public void delete(Long id) {
        cartItemRepository.deleteById(id);
    }

    public void clearByUserId(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
