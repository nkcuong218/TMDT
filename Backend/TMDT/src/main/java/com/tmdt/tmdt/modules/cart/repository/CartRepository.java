package com.tmdt.tmdt.modules.cart.repository;

import com.tmdt.tmdt.modules.cart.entity.Cart;
import com.tmdt.tmdt.modules.cart.entity.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserIdAndStatus(Long userId, CartStatus status);

    List<Cart> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Cart> findByCreatedAtBetweenOrderByCreatedAtAsc(LocalDateTime from, LocalDateTime to);

    List<Cart> findTop5ByOrderByCreatedAtDesc();

    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
