package com.tmdt.tmdt.modules.catalog.dto;

import java.math.BigDecimal;
import java.util.List;
public record ProductResponse(
        Long id,
        String name,
        String slug,
        String description,
        Long categoryId,
        BigDecimal basePrice,
        List<String> images
) {}

