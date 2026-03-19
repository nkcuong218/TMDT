package com.pthttmdt.tmdt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Long id;
    private Long categoryId;
    private String name;
    private String slug;
    private String skuRoot;
    private String brand;
    private BigDecimal basePrice;
    private BigDecimal originalPrice;
    private String primaryImage;
    private String descriptionHighlights;
    private String descriptionMaterial;
    private String descriptionFit;
    private String descriptionCare;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
