package com.pthttmdt.tmdt.controller;

import com.pthttmdt.tmdt.dto.ProductVariantDto;
import com.pthttmdt.tmdt.entity.ProductVariant;
import com.pthttmdt.tmdt.mapper.ProductVariantMapper;
import com.pthttmdt.tmdt.service.ProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/product-variants")
@RequiredArgsConstructor
public class ProductVariantController {
    private final ProductVariantService productVariantService;
    private final ProductVariantMapper productVariantMapper;

    @GetMapping
    public List<ProductVariantDto> getAll() {
        return productVariantService.getAll().stream().map(productVariantMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ProductVariantDto getById(@PathVariable Long id) {
        try {
            return productVariantMapper.toDto(productVariantService.getById(id));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProductVariantDto> getBySku(@PathVariable String sku) {
        return productVariantService.getBySku(sku)
                .map(productVariantMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{productId}")
    public List<ProductVariantDto> getByProductId(@PathVariable Long productId) {
        return productVariantService.getByProductId(productId).stream().map(productVariantMapper::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<ProductVariantDto> create(@RequestBody ProductVariantDto dto) {
        ProductVariant saved = productVariantService.save(productVariantMapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(productVariantMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ProductVariantDto update(@PathVariable Long id, @RequestBody ProductVariantDto dto) {
        dto.setId(id);
        ProductVariant saved = productVariantService.save(productVariantMapper.toEntity(dto));
        return productVariantMapper.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productVariantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
