package com.tmdt.tmdt.modules.order.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items", indexes = {
		@Index(name = "idx_order_items_order_id", columnList = "order_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "order_id", nullable = false)
	private Order order;

	@Column(name = "product_variant_id")
	private Long productVariantId;

	@Column(nullable = false, length = 300)
	private String productName;

	@Column(length = 100)
	private String sku;

	@Column(length = 50)
	private String size;

	@Column(length = 100)
	private String color;

	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal unitPrice;

	@Column(nullable = false)
	private Integer quantity;

	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal lineTotal;

}
