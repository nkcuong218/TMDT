package com.tmdt.tmdt.modules.catalog.mapper;

import org.springframework.stereotype.Component;

import com.tmdt.tmdt.modules.catalog.dto.ProductResponse;
import com.tmdt.tmdt.modules.catalog.entity.Product;
import com.tmdt.tmdt.modules.catalog.entity.ProductImage;
import java.util.Collections;
import java.util.List;


@Component
public class ProductMapper {

    public ProductResponse toProductResponse(Product product) {
        List<String> imageUrls = product.getImages() == null
            ? Collections.emptyList()
            : product.getImages().stream()
                .map(ProductImage::getImageUrl)
                .toList();

        Long categoryId = product.getCategory() == null ? null : product.getCategory().getId();

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescriptionHighlights(), // Hoặc kết hợp các phần mô tả khác nếu cần
            categoryId,
                product.getBasePrice(),
                imageUrls
        );
    }
}
