package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.entity.Product;
import com.pthttmdt.tmdt.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public List<Product> getAllActive() {
        return productRepository.findByIsActiveTrue();
    }

    public List<Product> getByCategoryId(Long categoryId, boolean activeOnly) {
        if (activeOnly) {
            return productRepository.findByCategoryIdAndIsActiveTrue(categoryId);
        }
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> search(String keyword, boolean activeOnly) {
        if (keyword == null || keyword.isBlank()) {
            return activeOnly ? getAllActive() : getAll();
        }

        if (activeOnly) {
            return productRepository.findByNameContainingIgnoreCaseOrSlugContainingIgnoreCaseAndIsActiveTrue(keyword, keyword);
        }
        return productRepository.findByNameContainingIgnoreCaseOrSlugContainingIgnoreCase(keyword, keyword);
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    public Optional<Product> getBySlug(String slug) {
        return productRepository.findBySlug(slug);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public Product setActive(Long id, boolean value) {
        Product product = getById(id);
        product.setIsActive(value);
        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
