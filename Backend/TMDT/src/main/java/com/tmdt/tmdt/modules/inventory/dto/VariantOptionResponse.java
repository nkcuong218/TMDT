package com.tmdt.tmdt.modules.inventory.dto;

public record VariantOptionResponse(
        Long productVariantId,
        String productName,
        String sku,
        String variantLabel
) {
}
