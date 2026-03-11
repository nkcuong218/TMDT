package com.tmdt.tmdt.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên sản phẩm
    @Column(nullable = false, length = 255)
    private String name;

    // SEO slug
    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    // SKU gốc
    @Column(nullable = false, unique = true, length = 100)
    private String skuRoot;

    // Danh mục
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // Thương hiệu
    @Column(length = 150)
    private String brand;

    // Giá chuẩn
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal basePrice;

    // Giá niêm yết
    @Column(precision = 15, scale = 2)
    private BigDecimal originalPrice;

    // Mô tả chia phần
    @Column(columnDefinition = "TEXT")
    private String descriptionHighlights;

    @Column(columnDefinition = "TEXT")
    private String descriptionMaterial;

    @Column(columnDefinition = "TEXT")
    private String descriptionFit;

    @Column(columnDefinition = "TEXT")
    private String descriptionCare;

    // Trạng thái bán
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // Quan hệ
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants;

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
