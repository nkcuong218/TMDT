package com.tmdt.tmdt.modules.order.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders", indexes = {
		@Index(name = "idx_orders_user_id", columnList = "user_id"),
		@Index(name = "idx_orders_status", columnList = "status"),
		@Index(name = "idx_orders_created_at", columnList = "created_at"),
		@Index(name = "idx_orders_code", columnList = "order_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "order_code", nullable = false, unique = true, length = 40)
	private String orderCode;

	@Column(name = "user_id", nullable = false)
	private Long userId;

	@Column(nullable = false, length = 120)
	private String customerName;

	@Column(nullable = false, length = 20)
	private String phone;

	@Column(nullable = false, length = 120)
	private String email;

	@Column(nullable = false, length = 500)
	private String address;

	@Column(length = 1000)
	private String note;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentMethod paymentMethod;

	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal subtotal;

	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal shippingFee;

	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal discountAmount;

	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal totalAmount;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private OrderStatus status;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItem> items;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();
	}

	@PreUpdate
	public void preUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

}
