package com.tmdt.tmdt.modules.inventory.service;

import com.tmdt.tmdt.modules.catalog.entity.ProductVariant;
import com.tmdt.tmdt.modules.catalog.repository.ProductVariantRepository;
import com.tmdt.tmdt.modules.inventory.dto.*;
import com.tmdt.tmdt.modules.inventory.entity.*;
import com.tmdt.tmdt.modules.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryServiceImpl implements InventoryService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final WarehouseLocationRepository warehouseLocationRepository;
    private final InventoryImportRepository inventoryImportRepository;
    private final InventoryImportItemRepository inventoryImportItemRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    public List<WarehouseItemResponse> getWarehouseItems(String keyword, String locationCode) {
        return inventoryRepository.findAll().stream()
                .filter(item -> filterByKeyword(item, keyword))
                .filter(item -> filterByLocation(item, locationCode))
                .sorted(Comparator.comparing(Inventory::getId))
                .map(item -> new WarehouseItemResponse(
                        item.getId(),
                        item.getProductVariant().getProduct().getName(),
                        item.getProductVariant().getSku(),
                        item.getProductVariant().getSize(),
                        item.getProductVariant().getColorName(),
                        item.getQuantity(),
                        item.getWarehouseLocation() == null ? "-" : item.getWarehouseLocation().getName()
                ))
                .toList();
    }

    @Override
    public WarehouseHistoryResponse getWarehouseHistory(Long inventoryId) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + inventoryId));

        ProductVariant variant = inventory.getProductVariant();

        List<WarehouseHistoryResponse.HistoryItem> history = stockMovementRepository
                .findByProductVariantIdOrderByCreatedAtDesc(variant.getId())
                .stream()
                .map(movement -> new WarehouseHistoryResponse.HistoryItem(
                        movement.getId(),
                        movement.getCreatedAt().format(DATE_TIME_FORMATTER),
                        mapMovementType(movement.getMovementType()),
                        movement.getQuantityChange(),
                        movement.getQuantityAfter(),
                        movement.getNote(),
                        movement.getActor(),
                        movement.getImportId()
                ))
                .toList();

        return new WarehouseHistoryResponse(
                new WarehouseHistoryResponse.ProductInfo(
                        inventory.getId(),
                        variant.getProduct().getName(),
                        variant.getSku(),
                        variant.getSize(),
                        variant.getColorName(),
                        inventory.getQuantity()
                ),
                history
        );
    }

    @Override
    public InventoryInvoiceResponse getInvoice(String importCode) {
        InventoryImport inventoryImport = inventoryImportRepository.findByCode(importCode)
                .orElseThrow(() -> new RuntimeException("Import invoice not found with code: " + importCode));

        return toInvoiceResponse(inventoryImport);
    }

    @Override
    @Transactional
    public InventoryInvoiceResponse createImport(CreateInventoryImportRequest request) {
        ensureDefaultLocations();

        SupplierOptionResponse supplier = getSupplierMap().get(request.supplierId());
        if (supplier == null) {
            throw new RuntimeException("Supplier not found with id: " + request.supplierId());
        }

        String importCode = "IMP-" + System.currentTimeMillis();

        InventoryImport inventoryImport = InventoryImport.builder()
                .code(importCode)
                .supplierName(supplier.name())
                .supplierAddress(supplier.address())
                .supplierPhone(supplier.phone())
                .supplierEmail(supplier.email())
                .note(buildNote(request))
                .createdBy("Admin")
                .totalAmount(BigDecimal.ZERO)
                .build();

        inventoryImport = inventoryImportRepository.save(inventoryImport);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CreateInventoryImportRequest.Item item : request.items()) {
            ProductVariant variant = productVariantRepository.findById(item.productVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found with id: " + item.productVariantId()));

            WarehouseLocation location = warehouseLocationRepository.findByCode(item.locationCode())
                    .orElseThrow(() -> new RuntimeException("Location not found with code: " + item.locationCode()));

            BigDecimal lineTotal = item.unitPrice().multiply(BigDecimal.valueOf(item.quantity()));

            InventoryImportItem importItem = InventoryImportItem.builder()
                    .inventoryImport(inventoryImport)
                    .productVariant(variant)
                    .quantity(item.quantity())
                    .unitPrice(item.unitPrice())
                    .lineTotal(lineTotal)
                    .build();
            inventoryImportItemRepository.save(importItem);

            Inventory inventory = inventoryRepository.findByProductVariantId(variant.getId())
                    .orElseGet(() -> Inventory.builder().productVariant(variant).quantity(0).build());

            int newQuantity = inventory.getQuantity() + item.quantity();
            inventory.setQuantity(newQuantity);
            inventory.setWarehouseLocation(location);
            inventoryRepository.save(inventory);

            variant.setStockQuantity(newQuantity);
            productVariantRepository.save(variant);

            StockMovement movement = StockMovement.builder()
                    .productVariant(variant)
                    .movementType(MovementType.IN)
                    .quantityChange(item.quantity())
                    .quantityAfter(newQuantity)
                    .note("Nhập kho từ phiếu " + importCode)
                    .actor("Admin")
                    .importId(importCode)
                    .build();
            stockMovementRepository.save(movement);

            totalAmount = totalAmount.add(lineTotal);
        }

        inventoryImport.setTotalAmount(totalAmount);
        inventoryImportRepository.save(inventoryImport);

        return toInvoiceResponse(inventoryImport);
    }

    @Override
    public List<SupplierOptionResponse> getSuppliers() {
        return new ArrayList<>(getSupplierMap().values());
    }

    @Override
    public List<VariantOptionResponse> getVariantOptions() {
        return productVariantRepository.findAll().stream()
                .map(variant -> new VariantOptionResponse(
                        variant.getId(),
                        variant.getProduct().getName(),
                        variant.getSku(),
                        (variant.getSize() == null ? "-" : variant.getSize()) + " - " + (variant.getColorName() == null ? "-" : variant.getColorName())
                ))
                .toList();
    }

    private InventoryInvoiceResponse toInvoiceResponse(InventoryImport inventoryImport) {
        List<InventoryInvoiceResponse.InvoiceItem> items = inventoryImportItemRepository
                .findByInventoryImportId(inventoryImport.getId())
                .stream()
                .map(item -> new InventoryInvoiceResponse.InvoiceItem(
                        item.getId(),
                        item.getProductVariant().getProduct().getName(),
                        item.getProductVariant().getSku(),
                        "Cai",
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getLineTotal()
                ))
                .toList();

        return new InventoryInvoiceResponse(
                inventoryImport.getCode(),
                inventoryImport.getCreatedAt().format(DATE_TIME_FORMATTER),
                inventoryImport.getCreatedBy(),
                new InventoryInvoiceResponse.SupplierInfo(
                        inventoryImport.getSupplierName(),
                        inventoryImport.getSupplierAddress(),
                        inventoryImport.getSupplierPhone(),
                        inventoryImport.getSupplierEmail()
                ),
                items,
                inventoryImport.getTotalAmount(),
                inventoryImport.getNote()
        );
    }

    private boolean filterByKeyword(Inventory inventory, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return true;
        }

        String lower = keyword.trim().toLowerCase(Locale.ROOT);
        ProductVariant variant = inventory.getProductVariant();
        String name = variant.getProduct().getName() == null ? "" : variant.getProduct().getName().toLowerCase(Locale.ROOT);
        String sku = variant.getSku() == null ? "" : variant.getSku().toLowerCase(Locale.ROOT);
        return name.contains(lower) || sku.contains(lower);
    }

    private boolean filterByLocation(Inventory inventory, String locationCode) {
        if (locationCode == null || locationCode.isBlank()) {
            return true;
        }

        if (inventory.getWarehouseLocation() == null) {
            return false;
        }

        return locationCode.equalsIgnoreCase(inventory.getWarehouseLocation().getCode());
    }

    private String mapMovementType(MovementType movementType) {
        return switch (movementType) {
            case IN -> "Nhập";
            case OUT -> "Xuất";
            case ADJUST -> "Kiểm";
        };
    }

    private String buildNote(CreateInventoryImportRequest request) {
        return List.of(
                        request.source() == null || request.source().isBlank() ? null : "Nguồn hàng: " + request.source(),
                        request.quality() == null || request.quality().isBlank() ? null : "Tình trạng: " + request.quality(),
                        request.storageNote() == null || request.storageNote().isBlank() ? null : "Lưu ý bảo quản: " + request.storageNote()
                ).stream()
                .filter(Objects::nonNull)
                .collect(Collectors.joining(" | "));
    }

    private void ensureDefaultLocations() {
        createLocationIfMissing("A1", "Kho A - Kệ 1");
        createLocationIfMissing("A2", "Kho A - Kệ 2");
        createLocationIfMissing("B3", "Kho B - Kệ 3");
        createLocationIfMissing("C1", "Kho C - Kệ 1");
    }

    private void createLocationIfMissing(String code, String name) {
        warehouseLocationRepository.findByCode(code)
                .orElseGet(() -> warehouseLocationRepository.save(WarehouseLocation.builder().code(code).name(name).description(name).build()));
    }

    private Map<Long, SupplierOptionResponse> getSupplierMap() {
        Map<Long, SupplierOptionResponse> suppliers = new LinkedHashMap<>();
        suppliers.put(1L, new SupplierOptionResponse(1L, "Công Ty TNHH May Mặc Việt Nam", "123 Đường KCN, Quận 9, TP.HCM", "0909123456", "contact@maymacvietnam.com"));
        suppliers.put(2L, new SupplierOptionResponse(2L, "Xưởng May Hà Nội", "88 Lê Trọng Tấn, Hà Nội", "0911888222", "xuongmayhn@example.com"));
        suppliers.put(3L, new SupplierOptionResponse(3L, "Nhà Cung Cấp Vải Sợi", "21 Trường Chinh, TP.HCM", "0933777555", "vaisoi@example.com"));
        return suppliers;
    }
}
