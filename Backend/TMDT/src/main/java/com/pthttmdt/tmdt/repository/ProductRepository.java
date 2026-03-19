package com.pthttmdt.tmdt.repository;

import com.pthttmdt.tmdt.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
	Optional<Product> findBySlug(String slug);

	boolean existsBySlug(String slug);

	List<Product> findByIsActiveTrue();

	List<Product> findByCategoryId(Long categoryId);

	List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);

	List<Product> findByNameContainingIgnoreCaseOrSlugContainingIgnoreCase(String keywordInName, String keywordInSlug);

	List<Product> findByNameContainingIgnoreCaseOrSlugContainingIgnoreCaseAndIsActiveTrue(
			String keywordInName,
			String keywordInSlug
	);
}
