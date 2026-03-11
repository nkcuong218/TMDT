package com.tmdt.tmdt.modules.inventory.service;

import com.tmdt.tmdt.modules.inventory.dto.*;

import java.util.List;

public interface InventoryService {
    List<WarehouseItemResponse> getWarehouseItems(String keyword, String locationCode);

    WarehouseHistoryResponse getWarehouseHistory(Long inventoryId);

    InventoryInvoiceResponse getInvoice(String importCode);

    InventoryInvoiceResponse createImport(CreateInventoryImportRequest request);

    List<SupplierOptionResponse> getSuppliers();

    List<VariantOptionResponse> getVariantOptions();
}
