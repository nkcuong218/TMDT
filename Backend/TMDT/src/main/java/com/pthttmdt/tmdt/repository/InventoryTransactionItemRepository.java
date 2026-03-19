package com.pthttmdt.tmdt.repository;

import com.pthttmdt.tmdt.entity.InventoryTransactionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryTransactionItemRepository extends JpaRepository<InventoryTransactionItem, Long> {
    List<InventoryTransactionItem> findByProductVariantIdOrderByIdDesc(Long productVariantId);
}
