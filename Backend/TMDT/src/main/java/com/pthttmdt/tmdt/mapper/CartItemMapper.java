package com.pthttmdt.tmdt.mapper;

import com.pthttmdt.tmdt.dto.CartItemDto;
import com.pthttmdt.tmdt.entity.CartItem;
import com.pthttmdt.tmdt.entity.ProductVariant;
import com.pthttmdt.tmdt.entity.User;
import org.springframework.stereotype.Component;

@Component
public class CartItemMapper {
    public CartItemDto toDto(CartItem entity) {
        if (entity == null) {
            return null;
        }

        Long userId = entity.getUser() != null ? entity.getUser().getId() : null;
        Long productVariantId = entity.getProductVariant() != null ? entity.getProductVariant().getId() : null;

        return CartItemDto.builder()
                .id(entity.getId())
                .userId(userId)
                .productVariantId(productVariantId)
                .quantity(entity.getQuantity())
                .build();
    }

    public CartItem toEntity(CartItemDto dto) {
        if (dto == null) {
            return null;
        }

        CartItem entity = new CartItem();
        entity.setId(dto.getId());

        if (dto.getUserId() != null) {
            User user = new User();
            user.setId(dto.getUserId());
            entity.setUser(user);
        }

        if (dto.getProductVariantId() != null) {
            ProductVariant productVariant = new ProductVariant();
            productVariant.setId(dto.getProductVariantId());
            entity.setProductVariant(productVariant);
        }

        entity.setQuantity(dto.getQuantity());
        return entity;
    }
}
