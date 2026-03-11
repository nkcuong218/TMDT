package com.tmdt.tmdt.modules.catalog.service.impl;

import com.tmdt.tmdt.modules.catalog.dto.ProductResponse;
import com.tmdt.tmdt.modules.catalog.entity.Product;
import com.tmdt.tmdt.modules.catalog.mapper.ProductMapper;
import com.tmdt.tmdt.modules.catalog.repository.ProductRepository;
import com.tmdt.tmdt.modules.catalog.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponse getProducts() {
        // This method returns a single product response - consider if this is the intended behavior
        // or if it should return List<ProductResponse> or Page<ProductResponse>
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            return null;
        }
        return productMapper.toProductResponse(products.get(0));
    }

    /**
     * Lấy sản phẩm theo ID
     */
    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return productMapper.toProductResponse(product);
    }

    /**
     * Lấy sản phẩm theo slug
     */
    @Override
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug);
        if (product == null) {
            throw new RuntimeException("Product not found with slug: " + slug);
        }
        return productMapper.toProductResponse(product);
    }

    /**
     * Tìm kiếm sản phẩm theo keyword
     */
    @Override
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        return products.map(productMapper::toProductResponse);
    }

    /**
     * Lấy sản phẩm theo danh mục
     */
    @Override
    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
        return products.map(productMapper::toProductResponse);
    }

    /**
     * Lấy tất cả sản phẩm active
     */
    @Override
    public Page<ProductResponse> getAllActiveProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        return products.map(productMapper::toProductResponse);
    }

    /**
     * Tạo sản phẩm mới
     */
    @Transactional
    @Override
    public ProductResponse createProduct(Product product) {
        Product savedProduct = productRepository.save(product);
        return productMapper.toProductResponse(savedProduct);
    }

    /**
     * Cập nhật sản phẩm
     */
    @Transactional
    @Override
    public ProductResponse updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setName(productDetails.getName());
        product.setSlug(productDetails.getSlug());
        product.setSkuRoot(productDetails.getSkuRoot());
        product.setBrand(productDetails.getBrand());
        product.setBasePrice(productDetails.getBasePrice());
        product.setOriginalPrice(productDetails.getOriginalPrice());
        product.setDescriptionHighlights(productDetails.getDescriptionHighlights());
        product.setDescriptionMaterial(productDetails.getDescriptionMaterial());
        product.setDescriptionFit(productDetails.getDescriptionFit());
        product.setDescriptionCare(productDetails.getDescriptionCare());
        product.setIsActive(productDetails.getIsActive());
        product.setCategory(productDetails.getCategory());

        Product updatedProduct = productRepository.save(product);
        return productMapper.toProductResponse(updatedProduct);
    }

    /**
     * Xóa sản phẩm
     */
    @Transactional
    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    /**
     * Thay đổi trạng thái sản phẩm
     */
    @Transactional
    @Override
    public ProductResponse toggleProductStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setIsActive(!product.getIsActive());
        Product updatedProduct = productRepository.save(product);
        return productMapper.toProductResponse(updatedProduct);
    }
}
