package com.tmdt.tmdt.modules.catalog.controller;

import com.tmdt.tmdt.modules.catalog.dto.ProductVariantDTO;
import com.tmdt.tmdt.modules.catalog.service.ProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products/{productId}/variants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    /**
     * GET: Lấy tất cả variant của sản phẩm
     */
    @GetMapping
    public ResponseEntity<List<ProductVariantDTO>> getVariants(@PathVariable Long productId) {
        List<ProductVariantDTO> variants = productVariantService.getVariantsByProductId(productId);
        return ResponseEntity.ok(variants);
    }

    /**
     * GET: Lấy variant theo ID
     */
    @GetMapping("/{variantId}")
    public ResponseEntity<ProductVariantDTO> getVariantById(@PathVariable Long variantId) {
        ProductVariantDTO variant = productVariantService.getVariantById(variantId);
        return ResponseEntity.ok(variant);
    }

    /**
     * GET: Lấy variant theo SKU
     */
    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProductVariantDTO> getVariantBySku(@PathVariable String sku) {
        ProductVariantDTO variant = productVariantService.getVariantBySku(sku);
        return ResponseEntity.ok(variant);
    }

    /**
     * GET: Lấy variant theo size
     */
    @GetMapping("/size/{size}")
    public ResponseEntity<List<ProductVariantDTO>> getVariantsBySize(
            @PathVariable Long productId,
            @PathVariable String size) {
        List<ProductVariantDTO> variants = productVariantService.getVariantsBySize(productId, size);
        return ResponseEntity.ok(variants);
    }

    /**
     * GET: Lấy variant theo màu
     */
    @GetMapping("/color/{colorName}")
    public ResponseEntity<List<ProductVariantDTO>> getVariantsByColor(
            @PathVariable Long productId,
            @PathVariable String colorName) {
        List<ProductVariantDTO> variants = productVariantService.getVariantsByColor(productId, colorName);
        return ResponseEntity.ok(variants);
    }

    /**
     * POST: Tạo variant mới
     */
    @PostMapping
    public ResponseEntity<ProductVariantDTO> createVariant(
            @PathVariable Long productId,
            @RequestBody ProductVariantDTO variantDTO) {
        ProductVariantDTO newVariant = productVariantService.createVariant(productId, variantDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newVariant);
    }

    /**
     * PUT: Cập nhật variant
     */
    @PutMapping("/{variantId}")
    public ResponseEntity<ProductVariantDTO> updateVariant(
            @PathVariable Long variantId,
            @RequestBody ProductVariantDTO variantDTO) {
        ProductVariantDTO updatedVariant = productVariantService.updateVariant(variantId, variantDTO);
        return ResponseEntity.ok(updatedVariant);
    }

    /**
     * DELETE: Xóa variant
     */
    @DeleteMapping("/{variantId}")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long variantId) {
        productVariantService.deleteVariant(variantId);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH: Cập nhật tồn kho
     */
    @PatchMapping("/{variantId}/stock")
    public ResponseEntity<ProductVariantDTO> updateStock(
            @PathVariable Long variantId,
            @RequestParam Integer quantity) {
        ProductVariantDTO variant = productVariantService.updateStock(variantId, quantity);
        return ResponseEntity.ok(variant);
    }
}
