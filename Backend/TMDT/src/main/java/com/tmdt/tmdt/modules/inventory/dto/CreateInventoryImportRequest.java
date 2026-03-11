package com.tmdt.tmdt.modules.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreateInventoryImportRequest(
        @NotNull Long supplierId,
        String source,
        String quality,
        String storageNote,
        @NotEmpty List<Item> items
) {
    public record Item(
            @NotNull Long productVariantId,
            @NotBlank String locationCode,
            @NotNull @Min(1) Integer quantity,
            @NotNull @Min(0) BigDecimal unitPrice
    ) {
    }
}
