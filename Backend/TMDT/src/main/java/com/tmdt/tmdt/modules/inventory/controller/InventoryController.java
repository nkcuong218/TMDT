package com.tmdt.tmdt.modules.inventory.controller;

import com.tmdt.tmdt.modules.inventory.dto.*;
import com.tmdt.tmdt.modules.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/items")
    public ResponseEntity<List<WarehouseItemResponse>> getWarehouseItems(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String locationCode
    ) {
        return ResponseEntity.ok(inventoryService.getWarehouseItems(keyword, locationCode));
    }

    @GetMapping("/items/{inventoryId}/history")
    public ResponseEntity<WarehouseHistoryResponse> getWarehouseHistory(@PathVariable Long inventoryId) {
        return ResponseEntity.ok(inventoryService.getWarehouseHistory(inventoryId));
    }

    @GetMapping("/imports/{importCode}")
    public ResponseEntity<InventoryInvoiceResponse> getInvoice(@PathVariable String importCode) {
        return ResponseEntity.ok(inventoryService.getInvoice(importCode));
    }

    @PostMapping("/imports")
    public ResponseEntity<InventoryInvoiceResponse> createImport(@Valid @RequestBody CreateInventoryImportRequest request) {
        return ResponseEntity.ok(inventoryService.createImport(request));
    }

    @GetMapping("/suppliers")
    public ResponseEntity<List<SupplierOptionResponse>> getSuppliers() {
        return ResponseEntity.ok(inventoryService.getSuppliers());
    }

    @GetMapping("/variant-options")
    public ResponseEntity<List<VariantOptionResponse>> getVariantOptions() {
        return ResponseEntity.ok(inventoryService.getVariantOptions());
    }
}
