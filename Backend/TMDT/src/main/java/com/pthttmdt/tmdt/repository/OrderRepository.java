package com.pthttmdt.tmdt.repository;

import com.pthttmdt.tmdt.entity.Order;
import com.pthttmdt.tmdt.entity.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
	Optional<Order> findByCode(String code);

	List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

	List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
}
