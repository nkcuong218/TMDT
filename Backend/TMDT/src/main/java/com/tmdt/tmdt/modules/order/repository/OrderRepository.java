package com.tmdt.tmdt.modules.order.repository;

import com.tmdt.tmdt.modules.order.entity.Order;
import com.tmdt.tmdt.modules.order.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
