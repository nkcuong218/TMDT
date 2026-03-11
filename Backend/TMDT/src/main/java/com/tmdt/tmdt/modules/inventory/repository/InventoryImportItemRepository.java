package com.tmdt.tmdt.modules.inventory.repository;

import com.tmdt.tmdt.modules.inventory.entity.InventoryImportItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryImportItemRepository extends JpaRepository<InventoryImportItem, Long> {
    List<InventoryImportItem> findByInventoryImportId(Long inventoryImportId);
}
