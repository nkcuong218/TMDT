package com.tmdt.tmdt.modules.inventory.dto;

import java.util.List;

public record WarehouseHistoryResponse(
        ProductInfo product,
        List<HistoryItem> history
) {
    public record ProductInfo(
            Long id,
            String name,
            String sku,
            String size,
            String color,
            Integer currentStock
    ) {
    }

    public record HistoryItem(
            Long id,
            String date,
            String type,
            Integer quantity,
            Integer remaining,
            String note,
            String user,
            String importId
    ) {
    }
}
