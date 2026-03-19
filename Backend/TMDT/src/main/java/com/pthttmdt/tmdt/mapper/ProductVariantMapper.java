package com.pthttmdt.tmdt.mapper;

import com.pthttmdt.tmdt.dto.ProductVariantDto;
import com.pthttmdt.tmdt.entity.Product;
import com.pthttmdt.tmdt.entity.ProductVariant;
import org.springframework.stereotype.Component;

@Component
public class ProductVariantMapper {
    public ProductVariantDto toDto(ProductVariant entity) {
        if (entity == null) {
            return null;
        }

        Long productId = entity.getProduct() != null ? entity.getProduct().getId() : null;

        return ProductVariantDto.builder()
                .id(entity.getId())
                .productId(productId)
                .sku(entity.getSku())
                .color(entity.getColor())
                .size(entity.getSize())
                .stock(entity.getStock())
                .priceOverride(entity.getPriceOverride())
                .build();
    }

    public ProductVariant toEntity(ProductVariantDto dto) {
        if (dto == null) {
            return null;
        }

        ProductVariant entity = new ProductVariant();
        entity.setId(dto.getId());

        if (dto.getProductId() != null) {
            Product product = new Product();
            product.setId(dto.getProductId());
            entity.setProduct(product);
        }

        entity.setSku(dto.getSku());
        entity.setColor(dto.getColor());
        entity.setSize(dto.getSize());
        entity.setStock(dto.getStock());
        entity.setPriceOverride(dto.getPriceOverride());
        return entity;
    }
}
