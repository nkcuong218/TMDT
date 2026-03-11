package com.tmdt.tmdt.modules.inventory.dto;

public record WarehouseItemResponse(
        Long id,
        String name,
        String sku,
        String size,
        String color,
        Integer quantity,
        String location
) {
}
