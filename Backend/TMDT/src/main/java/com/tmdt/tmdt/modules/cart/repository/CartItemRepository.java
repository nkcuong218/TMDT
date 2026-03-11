package com.tmdt.tmdt.modules.cart.repository;

import com.tmdt.tmdt.modules.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(Long cartId);

    List<CartItem> findByCartIdIn(List<Long> cartIds);

    Optional<CartItem> findByCartIdAndProductVariantId(Long cartId, Long productVariantId);
}
