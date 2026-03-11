package com.tmdt.tmdt.modules.inventory.repository;

import com.tmdt.tmdt.modules.inventory.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByProductVariantIdOrderByCreatedAtDesc(Long productVariantId);

    List<StockMovement> findByImportIdOrderByCreatedAtAsc(String importId);
}
