package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.entity.ProductVariant;
import com.pthttmdt.tmdt.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductVariantService {
    private final ProductVariantRepository productVariantRepository;

    public List<ProductVariant> getAll() {
        return productVariantRepository.findAll();
    }

    public ProductVariant getById(Long id) {
        return productVariantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product variant not found with id: " + id));
    }

    public Optional<ProductVariant> getBySku(String sku) {
        return productVariantRepository.findBySku(sku);
    }

    public List<ProductVariant> getByProductId(Long productId) {
        return productVariantRepository.findByProductId(productId);
    }

    public ProductVariant save(ProductVariant productVariant) {
        return productVariantRepository.save(productVariant);
    }

    public void delete(Long id) {
        productVariantRepository.deleteById(id);
    }
}
