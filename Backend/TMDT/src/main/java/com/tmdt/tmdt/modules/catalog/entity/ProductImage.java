package com.tmdt.tmdt.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Sản phẩm cha
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // URL ảnh
    @Column(nullable = false, length = 500)
    private String imageUrl;

    // Ảnh đại diện
    @Column(nullable = false)
    private Boolean isPrimary = false;

    // Thứ tự hiển thị
    private Integer sortOrder = 0;

    // SEO / accessibility
    @Column(length = 255)
    private String altText;
}
