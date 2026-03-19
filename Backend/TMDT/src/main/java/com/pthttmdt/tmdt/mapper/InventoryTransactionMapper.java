package com.pthttmdt.tmdt.mapper;

import com.pthttmdt.tmdt.dto.InventoryTransactionDto;
import com.pthttmdt.tmdt.entity.InventoryTransaction;
import com.pthttmdt.tmdt.entity.Supplier;
import com.pthttmdt.tmdt.entity.User;
import org.springframework.stereotype.Component;

@Component
public class InventoryTransactionMapper {
    public InventoryTransactionDto toDto(InventoryTransaction entity) {
        if (entity == null) {
            return null;
        }

        Long supplierId = entity.getSupplier() != null ? entity.getSupplier().getId() : null;
        Long createdById = entity.getCreatedBy() != null ? entity.getCreatedBy().getId() : null;

        return InventoryTransactionDto.builder()
                .id(entity.getId())
                .transactionCode(entity.getTransactionCode())
                .type(entity.getType())
                .supplierId(supplierId)
                .source(entity.getSource())
                .qualityStatus(entity.getQualityStatus())
                .storageNote(entity.getStorageNote())
                .totalAmount(entity.getTotalAmount())
                .createdById(createdById)
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public InventoryTransaction toEntity(InventoryTransactionDto dto) {
        if (dto == null) {
            return null;
        }

        InventoryTransaction entity = new InventoryTransaction();
        entity.setId(dto.getId());
        entity.setTransactionCode(dto.getTransactionCode());
        entity.setType(dto.getType());

        if (dto.getSupplierId() != null) {
            Supplier supplier = new Supplier();
            supplier.setId(dto.getSupplierId());
            entity.setSupplier(supplier);
        }

        entity.setSource(dto.getSource());
        entity.setQualityStatus(dto.getQualityStatus());
        entity.setStorageNote(dto.getStorageNote());
        entity.setTotalAmount(dto.getTotalAmount());

        if (dto.getCreatedById() != null) {
            User createdBy = new User();
            createdBy.setId(dto.getCreatedById());
            entity.setCreatedBy(createdBy);
        }

        entity.setCreatedAt(dto.getCreatedAt());
        return entity;
    }
}
