package com.pthttmdt.tmdt.controller;

import com.pthttmdt.tmdt.dto.ProductDto;
import com.pthttmdt.tmdt.entity.Product;
import com.pthttmdt.tmdt.mapper.ProductMapper;
import com.pthttmdt.tmdt.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final ProductMapper productMapper;

    @GetMapping
    public List<ProductDto> getAll() {
        return productService.getAll().stream().map(productMapper::toDto).toList();
    }

    @GetMapping("/active")
    public List<ProductDto> getAllActive() {
        return productService.getAllActive().stream().map(productMapper::toDto).toList();
    }

        @GetMapping("/category/{categoryId}")
        public List<ProductDto> getByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "false") boolean activeOnly
        ) {
        return productService.getByCategoryId(categoryId, activeOnly)
            .stream()
            .map(productMapper::toDto)
            .toList();
        }

        @GetMapping("/search")
        public List<ProductDto> search(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "false") boolean activeOnly
        ) {
        return productService.search(q, activeOnly)
            .stream()
            .map(productMapper::toDto)
            .toList();
        }

    @GetMapping("/{id}")
    public ProductDto getById(@PathVariable Long id) {
        try {
            return productMapper.toDto(productService.getById(id));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDto> getBySlug(@PathVariable String slug) {
        return productService.getBySlug(slug)
                .map(productMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductDto> create(@RequestBody ProductDto dto) {
        Product saved = productService.save(productMapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(productMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable Long id, @RequestBody ProductDto dto) {
        dto.setId(id);
        Product saved = productService.save(productMapper.toEntity(dto));
        return productMapper.toDto(saved);
    }

    @PatchMapping("/{id}/active")
    public ProductDto setActive(@PathVariable Long id, @RequestParam boolean value) {
        try {
            return productMapper.toDto(productService.setActive(id, value));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
