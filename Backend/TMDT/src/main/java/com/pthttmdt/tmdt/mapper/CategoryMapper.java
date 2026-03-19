package com.pthttmdt.tmdt.mapper;

import com.pthttmdt.tmdt.dto.CategoryDto;
import com.pthttmdt.tmdt.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public CategoryDto toDto(Category entity) {
        if (entity == null) {
            return null;
        }

        return CategoryDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .build();
    }

    public Category toEntity(CategoryDto dto) {
        if (dto == null) {
            return null;
        }

        Category entity = new Category();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setSlug(dto.getSlug());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}
