package com.tmdt.tmdt.modules.catalog.repository;

import com.tmdt.tmdt.modules.catalog.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductIdOrderBySortOrderAsc(Long productId);
    
    List<ProductImage> findByProductId(Long productId);
}
