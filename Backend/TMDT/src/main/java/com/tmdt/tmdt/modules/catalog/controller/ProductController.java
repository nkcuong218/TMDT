package com.tmdt.tmdt.modules.catalog.controller;

import com.tmdt.tmdt.modules.catalog.dto.ProductCreateRequest;
import com.tmdt.tmdt.modules.catalog.dto.ProductResponse;
import com.tmdt.tmdt.modules.catalog.entity.Category;
import com.tmdt.tmdt.modules.catalog.entity.Product;
import com.tmdt.tmdt.modules.catalog.repository.CategoryRepository;
import com.tmdt.tmdt.modules.catalog.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;

    /**
     * GET: Lấy tất cả sản phẩm
     */
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProduct(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getAllActiveProducts(pageable);
        return ResponseEntity.ok(products);
    }

    /**
     * GET: Lấy sản phẩm theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * GET: Lấy sản phẩm theo slug
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductResponse> getProductBySlug(@PathVariable String slug) {
        ProductResponse product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(product);
    }

    /**
     * GET: Tìm kiếm sản phẩm
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.searchProducts(keyword, pageable);
        return ResponseEntity.ok(products);
    }

    /**
     * GET: Lấy sản phẩm theo danh mục
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductResponse>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getProductsByCategory(categoryId, pageable);
        return ResponseEntity.ok(products);
    }

    /**
     * POST: Tạo sản phẩm mới
     */
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.categoryId()));

        Product product = Product.builder()
                .name(request.name())
                .slug(request.slug())
                .skuRoot(request.skuRoot())
                .category(category)
                .brand(request.brand())
                .basePrice(request.basePrice())
                .originalPrice(request.originalPrice())
                .descriptionHighlights(request.descriptionHighlights())
                .descriptionMaterial(request.descriptionMaterial())
                .descriptionFit(request.descriptionFit())
                .descriptionCare(request.descriptionCare())
                .isActive(true)
                .build();

        ProductResponse newProduct = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
    }

    /**
     * PUT: Cập nhật sản phẩm
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody Product productDetails) {
        ProductResponse updatedProduct = productService.updateProduct(id, productDetails);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * DELETE: Xóa sản phẩm
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH: Thay đổi trạng thái sản phẩm (active/inactive)
     */
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ProductResponse> toggleProductStatus(@PathVariable Long id) {
        ProductResponse product = productService.toggleProductStatus(id);
        return ResponseEntity.ok(product);
    }
}
