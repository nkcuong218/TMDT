package com.tmdt.tmdt.modules.inventory.entity;

import com.tmdt.tmdt.modules.catalog.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventories", indexes = {
		@Index(name = "idx_inventory_variant", columnList = "product_variant_id", unique = true),
		@Index(name = "idx_inventory_location", columnList = "warehouse_location_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "product_variant_id", nullable = false, unique = true)
	private ProductVariant productVariant;

	@ManyToOne
	@JoinColumn(name = "warehouse_location_id")
	private WarehouseLocation warehouseLocation;

	@Column(nullable = false)
	@Builder.Default
	private Integer quantity = 0;

	private LocalDateTime updatedAt;

	@PrePersist
	@PreUpdate
	public void touch() {
		this.updatedAt = LocalDateTime.now();
	}

}
