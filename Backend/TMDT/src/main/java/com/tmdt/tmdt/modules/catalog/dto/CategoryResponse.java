package com.tmdt.tmdt.modules.catalog.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CategoryResponse(
        Long id,
        String name,
        String slug,
        Boolean isActive,
        Integer sortOrder,
        Long parentId,
        List<CategoryResponse> children,
        LocalDateTime createdAt
) {}
