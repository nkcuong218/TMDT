package com.pthttmdt.tmdt.controller;

import com.pthttmdt.tmdt.dto.CategoryDto;
import com.pthttmdt.tmdt.entity.Category;
import com.pthttmdt.tmdt.mapper.CategoryMapper;
import com.pthttmdt.tmdt.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @GetMapping
    public List<CategoryDto> getAll() {
        return categoryService.getAll().stream().map(categoryMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public CategoryDto getById(@PathVariable Long id) {
        try {
            return categoryMapper.toDto(categoryService.getById(id));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<CategoryDto> getBySlug(@PathVariable String slug) {
        return categoryService.getBySlug(slug)
                .map(categoryMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoryDto> create(@RequestBody CategoryDto dto) {
        Category saved = categoryService.save(categoryMapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public CategoryDto update(@PathVariable Long id, @RequestBody CategoryDto dto) {
        dto.setId(id);
        Category saved = categoryService.save(categoryMapper.toEntity(dto));
        return categoryMapper.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
