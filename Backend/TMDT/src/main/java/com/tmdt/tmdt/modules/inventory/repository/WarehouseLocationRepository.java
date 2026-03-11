package com.tmdt.tmdt.modules.inventory.repository;

import com.tmdt.tmdt.modules.inventory.entity.WarehouseLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WarehouseLocationRepository extends JpaRepository<WarehouseLocation, Long> {
    Optional<WarehouseLocation> findByCode(String code);
}
