package com.tmdt.tmdt.modules.catalog.mapper;

import com.tmdt.tmdt.modules.catalog.dto.ProductVariantDTO;
import com.tmdt.tmdt.modules.catalog.entity.ProductVariant;
import com.tmdt.tmdt.modules.catalog.entity.VariantStatus;
import org.springframework.stereotype.Component;

@Component
public class ProductVariantMapper {

    public ProductVariantDTO toProductVariantDTO(ProductVariant variant) {
        return new ProductVariantDTO(
                variant.getId(),
                variant.getSku(),
                variant.getSize(),
                variant.getColorName(),
                variant.getStockQuantity(),
                variant.getPriceOverride() != null ? variant.getPriceOverride() : variant.getProduct().getBasePrice(),
                variant.getStatus().toString()
        );
    }

    public ProductVariant toProductVariant(ProductVariantDTO dto) {
        return ProductVariant.builder()
                .sku(dto.sku())
                .size(dto.size())
                .colorName(dto.color())
                .stockQuantity(dto.stock())
                .status(VariantStatus.valueOf(dto.status()))
                .build();
    }
}
