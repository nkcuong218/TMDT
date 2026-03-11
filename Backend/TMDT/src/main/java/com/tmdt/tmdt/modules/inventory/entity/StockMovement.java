package com.tmdt.tmdt.modules.inventory.entity;

import com.tmdt.tmdt.modules.catalog.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements", indexes = {
		@Index(name = "idx_stock_movement_variant_created", columnList = "product_variant_id,created_at"),
		@Index(name = "idx_stock_movement_import", columnList = "import_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovement {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "product_variant_id", nullable = false)
	private ProductVariant productVariant;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private MovementType movementType;

	@Column(nullable = false)
	private Integer quantityChange;

	@Column(nullable = false)
	private Integer quantityAfter;

	@Column(length = 500)
	private String note;

	@Column(length = 100)
	private String actor;

	@Column(name = "import_id", length = 100)
	private String importId;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();
	}

}
