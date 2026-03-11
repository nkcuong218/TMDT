package com.tmdt.tmdt.modules.inventory.dto;

import java.math.BigDecimal;
import java.util.List;

public record InventoryInvoiceResponse(
        String id,
        String date,
        String creator,
        SupplierInfo supplier,
        List<InvoiceItem> items,
        BigDecimal totalAmount,
        String note
) {
    public record SupplierInfo(
            String name,
            String address,
            String phone,
            String email
    ) {
    }

    public record InvoiceItem(
            Long id,
            String name,
            String sku,
            String unit,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal total
    ) {
    }
}
