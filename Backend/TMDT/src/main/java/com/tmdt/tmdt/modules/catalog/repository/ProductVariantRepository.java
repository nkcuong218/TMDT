package com.tmdt.tmdt.modules.catalog.repository;

import com.tmdt.tmdt.modules.catalog.entity.ProductVariant;
import com.tmdt.tmdt.modules.catalog.entity.VariantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    Optional<ProductVariant> findBySku(String sku);
    
    List<ProductVariant> findByProductId(Long productId);
    
    List<ProductVariant> findByProductIdAndStatus(Long productId, VariantStatus status);
    
    List<ProductVariant> findByProductIdAndSize(Long productId, String size);
    
    List<ProductVariant> findByProductIdAndColorName(Long productId, String colorName);
}
