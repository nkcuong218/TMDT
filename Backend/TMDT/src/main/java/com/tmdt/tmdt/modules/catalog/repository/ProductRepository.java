package com.tmdt.tmdt.modules.catalog.repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.tmdt.tmdt.modules.catalog.entity.Product;

import java.time.LocalDateTime;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByIsActiveTrue(Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    Product findBySlug(String slug);

    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
