package com.tmdt.tmdt.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Product cha
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // SKU riêng
    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    // Màu sắc
    @Column(length = 100)
    private String colorName;

    @Column(length = 20)
    private String colorCode; // ví dụ: #FFFFFF

    // Size
    @Column(length = 20)
    private String size;

    // Giá override
    @Column(precision = 15, scale = 2)
    private BigDecimal priceOverride;

    // Tồn kho
    @Column(nullable = false)
    private Integer stockQuantity = 0;

    // Trạng thái
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VariantStatus status = VariantStatus.ACTIVE;

    // Audit
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

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
