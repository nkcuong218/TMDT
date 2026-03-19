package com.pthttmdt.tmdt.mapper;

import com.pthttmdt.tmdt.dto.SupplierDto;
import com.pthttmdt.tmdt.entity.Supplier;
import org.springframework.stereotype.Component;

@Component
public class SupplierMapper {
    public SupplierDto toDto(Supplier entity) {
        if (entity == null) {
            return null;
        }

        return SupplierDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .taxCode(entity.getTaxCode())
                .status(entity.getStatus())
                .build();
    }

    public Supplier toEntity(SupplierDto dto) {
        if (dto == null) {
            return null;
        }

        Supplier entity = new Supplier();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setPhone(dto.getPhone());
        entity.setAddress(dto.getAddress());
        entity.setTaxCode(dto.getTaxCode());
        entity.setStatus(dto.getStatus());
        return entity;
    }
}
