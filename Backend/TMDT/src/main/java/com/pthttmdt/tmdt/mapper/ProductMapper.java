package com.pthttmdt.tmdt.mapper;

import com.pthttmdt.tmdt.dto.ProductDto;
import com.pthttmdt.tmdt.entity.Category;
import com.pthttmdt.tmdt.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {
    public ProductDto toDto(Product entity) {
        if (entity == null) {
            return null;
        }

        Long categoryId = entity.getCategory() != null ? entity.getCategory().getId() : null;

        return ProductDto.builder()
                .id(entity.getId())
                .categoryId(categoryId)
                .name(entity.getName())
                .slug(entity.getSlug())
                .skuRoot(entity.getSkuRoot())
                .brand(entity.getBrand())
                .basePrice(entity.getBasePrice())
                .originalPrice(entity.getOriginalPrice())
                .primaryImage(entity.getPrimaryImage())
                .descriptionHighlights(entity.getDescriptionHighlights())
                .descriptionMaterial(entity.getDescriptionMaterial())
                .descriptionFit(entity.getDescriptionFit())
                .descriptionCare(entity.getDescriptionCare())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public Product toEntity(ProductDto dto) {
        if (dto == null) {
            return null;
        }

        Product entity = new Product();
        entity.setId(dto.getId());

        if (dto.getCategoryId() != null) {
            Category category = new Category();
            category.setId(dto.getCategoryId());
            entity.setCategory(category);
        }

        entity.setName(dto.getName());
        entity.setSlug(dto.getSlug());
        entity.setSkuRoot(dto.getSkuRoot());
        entity.setBrand(dto.getBrand());
        entity.setBasePrice(dto.getBasePrice());
        entity.setOriginalPrice(dto.getOriginalPrice());
        entity.setPrimaryImage(dto.getPrimaryImage());
        entity.setDescriptionHighlights(dto.getDescriptionHighlights());
        entity.setDescriptionMaterial(dto.getDescriptionMaterial());
        entity.setDescriptionFit(dto.getDescriptionFit());
        entity.setDescriptionCare(dto.getDescriptionCare());
        entity.setIsActive(dto.getIsActive());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        return entity;
    }
}
