package com.tmdt.tmdt.modules.catalog.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductDetailResponse(
        Long id,
        String name,
        String slug,
        String skuRoot,
        String brand,
        BigDecimal basePrice,
        BigDecimal originalPrice,
        String descriptionHighlights,
        String descriptionMaterial,
        String descriptionFit,
        String descriptionCare,
        Boolean isActive,
        Long categoryId,
        String categoryName,
        List<String> images,
        List<ProductVariantDTO> variants,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
