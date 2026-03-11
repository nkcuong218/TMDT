package com.tmdt.tmdt.modules.catalog.service.impl;

import com.tmdt.tmdt.modules.catalog.dto.ProductVariantDTO;
import com.tmdt.tmdt.modules.catalog.entity.ProductVariant;
import com.tmdt.tmdt.modules.catalog.entity.VariantStatus;
import com.tmdt.tmdt.modules.catalog.mapper.ProductVariantMapper;
import com.tmdt.tmdt.modules.catalog.repository.ProductRepository;
import com.tmdt.tmdt.modules.catalog.repository.ProductVariantRepository;
import com.tmdt.tmdt.modules.catalog.service.ProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ProductVariantMapper productVariantMapper;

    @Override
    public List<ProductVariantDTO> getVariantsByProductId(Long productId) {
        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
        return variants.stream()
                .map(productVariantMapper::toProductVariantDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductVariantDTO getVariantById(Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found with id: " + variantId));
        return productVariantMapper.toProductVariantDTO(variant);
    }

    @Override
    public ProductVariantDTO getVariantBySku(String sku) {
        ProductVariant variant = productVariantRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Variant not found with sku: " + sku));
        return productVariantMapper.toProductVariantDTO(variant);
    }

    @Override
    public List<ProductVariantDTO> getVariantsBySize(Long productId, String size) {
        List<ProductVariant> variants = productVariantRepository.findByProductIdAndSize(productId, size);
        return variants.stream()
                .map(productVariantMapper::toProductVariantDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductVariantDTO> getVariantsByColor(Long productId, String colorName) {
        List<ProductVariant> variants = productVariantRepository.findByProductIdAndColorName(productId, colorName);
        return variants.stream()
                .map(productVariantMapper::toProductVariantDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductVariantDTO createVariant(Long productId, ProductVariantDTO variantDTO) {
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        ProductVariant variant = productVariantMapper.toProductVariant(variantDTO);
        variant.setProduct(product);

        ProductVariant savedVariant = productVariantRepository.save(variant);
        return productVariantMapper.toProductVariantDTO(savedVariant);
    }

    @Override
    @Transactional
    public ProductVariantDTO updateVariant(Long variantId, ProductVariantDTO variantDTO) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found with id: " + variantId));

        variant.setSku(variantDTO.sku());
        variant.setSize(variantDTO.size());
        variant.setColorName(variantDTO.color());
        variant.setStockQuantity(variantDTO.stock());
        variant.setStatus(VariantStatus.valueOf(variantDTO.status()));

        ProductVariant updatedVariant = productVariantRepository.save(variant);
        return productVariantMapper.toProductVariantDTO(updatedVariant);
    }

    @Override
    @Transactional
    public void deleteVariant(Long variantId) {
        if (!productVariantRepository.existsById(variantId)) {
            throw new RuntimeException("Variant not found with id: " + variantId);
        }
        productVariantRepository.deleteById(variantId);
    }

    @Override
    @Transactional
    public ProductVariantDTO updateStock(Long variantId, Integer quantity) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found with id: " + variantId));
        variant.setStockQuantity(quantity);
        ProductVariant updatedVariant = productVariantRepository.save(variant);
        return productVariantMapper.toProductVariantDTO(updatedVariant);
    }
}
