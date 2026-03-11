package com.tmdt.tmdt.modules.catalog.mapper;

import com.tmdt.tmdt.modules.catalog.dto.CategoryResponse;
import com.tmdt.tmdt.modules.catalog.entity.Category;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {

    public CategoryResponse toCategoryResponse(Category category) {
        List<CategoryResponse> childResponses = new ArrayList<>();
        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            childResponses = category.getChildren().stream()
                    .map(this::toCategoryResponse)
                    .collect(Collectors.toList());
        }

        Long parentId = category.getParent() != null ? category.getParent().getId() : null;

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getIsActive(),
                category.getSortOrder(),
                parentId,
                childResponses,
                category.getCreatedAt()
        );
    }

    public Category toCategory(CategoryResponse dto) {
        return Category.builder()
                .name(dto.name())
                .slug(dto.slug())
                .isActive(dto.isActive())
                .sortOrder(dto.sortOrder())
                .build();
    }
}
