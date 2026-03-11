package com.tmdt.tmdt.modules.catalog.service;

import com.tmdt.tmdt.modules.catalog.dto.ProductResponse;
import com.tmdt.tmdt.modules.catalog.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    ProductResponse getProducts();

    ProductResponse getProductById(Long id);

    ProductResponse getProductBySlug(String slug);

    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);

    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

    Page<ProductResponse> getAllActiveProducts(Pageable pageable);

    ProductResponse createProduct(Product product);

    ProductResponse updateProduct(Long id, Product productDetails);

    void deleteProduct(Long id);

    ProductResponse toggleProductStatus(Long id);
}
