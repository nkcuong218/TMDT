package com.tmdt.tmdt.modules.inventory.repository;

import com.tmdt.tmdt.modules.inventory.entity.InventoryImport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryImportRepository extends JpaRepository<InventoryImport, Long> {
    Optional<InventoryImport> findByCode(String code);
}
