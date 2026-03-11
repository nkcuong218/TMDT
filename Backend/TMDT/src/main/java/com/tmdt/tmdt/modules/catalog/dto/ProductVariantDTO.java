package com.tmdt.tmdt.modules.catalog.dto;

import java.math.BigDecimal;

public record ProductVariantDTO(
        Long id,
        String sku,
        String size,
        String color,
        Integer stock,
        BigDecimal price,
        String status
) {}
