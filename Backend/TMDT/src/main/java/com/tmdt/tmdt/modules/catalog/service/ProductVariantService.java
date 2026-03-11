package com.tmdt.tmdt.modules.catalog.service;

import com.tmdt.tmdt.modules.catalog.dto.ProductVariantDTO;
import java.util.List;

public interface ProductVariantService {
    /**
     * Lấy tất cả variant của sản phẩm
     */
    List<ProductVariantDTO> getVariantsByProductId(Long productId);

    /**
     * Lấy variant theo ID
     */
    ProductVariantDTO getVariantById(Long variantId);

    /**
     * Lấy variant theo SKU
     */
    ProductVariantDTO getVariantBySku(String sku);

    /**
     * Lấy variant theo size
     */
    List<ProductVariantDTO> getVariantsBySize(Long productId, String size);

    /**
     * Lấy variant theo màu
     */
    List<ProductVariantDTO> getVariantsByColor(Long productId, String colorName);

    /**
     * Tạo variant mới
     */
    ProductVariantDTO createVariant(Long productId, ProductVariantDTO variantDTO);

    /**
     * Cập nhật variant
     */
    ProductVariantDTO updateVariant(Long variantId, ProductVariantDTO variantDTO);

    /**
     * Xóa variant
     */
    void deleteVariant(Long variantId);

    /**
     * Cập nhật tồn kho
     */
    ProductVariantDTO updateStock(Long variantId, Integer quantity);
}
