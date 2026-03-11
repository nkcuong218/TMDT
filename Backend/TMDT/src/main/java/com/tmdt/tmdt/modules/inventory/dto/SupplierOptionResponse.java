package com.tmdt.tmdt.modules.inventory.dto;

public record SupplierOptionResponse(
        Long id,
        String name,
        String address,
        String phone,
        String email
) {
}
