package com.tmdt.tmdt.modules.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductCreateRequest(
        @NotBlank(message = "Product name is required")
        String name,
        
        @NotBlank(message = "Product slug is required")
        String slug,
        
        @NotBlank(message = "SKU root is required")
        String skuRoot,
        
        @NotNull(message = "Category ID is required")
        Long categoryId,
        
        String brand,
        
        @NotNull(message = "Base price is required")
        BigDecimal basePrice,
        
        BigDecimal originalPrice,
        
        String descriptionHighlights,
        String descriptionMaterial,
        String descriptionFit,
        String descriptionCare
) {}
