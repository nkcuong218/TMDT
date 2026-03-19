package com.pthttmdt.tmdt.mapper;

import com.pthttmdt.tmdt.dto.VoucherDto;
import com.pthttmdt.tmdt.entity.Voucher;
import org.springframework.stereotype.Component;

@Component
public class VoucherMapper {
    public VoucherDto toDto(Voucher entity) {
        if (entity == null) {
            return null;
        }

        return VoucherDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .type(entity.getType())
                .discountAmount(entity.getDiscountAmount())
                .minOrderValue(entity.getMinOrderValue())
                .description(entity.getDescription())
                .validFrom(entity.getValidFrom())
                .validUntil(entity.getValidUntil())
                .isActive(entity.getIsActive())
                .build();
    }

    public Voucher toEntity(VoucherDto dto) {
        if (dto == null) {
            return null;
        }

        Voucher entity = new Voucher();
        entity.setId(dto.getId());
        entity.setCode(dto.getCode());
        entity.setType(dto.getType());
        entity.setDiscountAmount(dto.getDiscountAmount());
        entity.setMinOrderValue(dto.getMinOrderValue());
        entity.setDescription(dto.getDescription());
        entity.setValidFrom(dto.getValidFrom());
        entity.setValidUntil(dto.getValidUntil());
        entity.setIsActive(dto.getIsActive());
        return entity;
    }
}
