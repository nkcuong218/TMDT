package com.tmdt.tmdt.modules.inventory.repository;

import com.tmdt.tmdt.modules.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductVariantId(Long productVariantId);
}
