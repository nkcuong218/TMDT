# Catalog Service API Documentation

## Overview
The Catalog Service provides comprehensive REST APIs for managing products, categories, and product variants in the e-commerce platform.

## API Endpoints

### Products

#### Get All Products
```
GET /api/v1/products
Parameters:
  - page (default: 0)
  - size (default: 10)
Response: Page<ProductResponse>
```

#### Get Product by ID
```
GET /api/v1/products/{id}
Response: ProductResponse
```

#### Get Product by Slug
```
GET /api/v1/products/slug/{slug}
Response: ProductResponse
```

#### Search Products
```
GET /api/v1/products/search
Parameters:
  - keyword (required)
  - page (default: 0)
  - size (default: 10)
Response: Page<ProductResponse>
```

#### Get Products by Category
```
GET /api/v1/products/category/{categoryId}
Parameters:
  - page (default: 0)
  - size (default: 10)
Response: Page<ProductResponse>
```

#### Create Product
```
POST /api/v1/products
Body: ProductCreateRequest
Response: ProductResponse (Status: 201)
```

#### Update Product
```
PUT /api/v1/products/{id}
Body: Product
Response: ProductResponse
```

#### Delete Product
```
DELETE /api/v1/products/{id}
Response: No Content (204)
```

#### Toggle Product Status
```
PATCH /api/v1/products/{id}/toggle-status
Response: ProductResponse
```

### Categories

#### Get All Categories
```
GET /api/v1/categories
Response: List<CategoryResponse>
```

#### Get Category by ID
```
GET /api/v1/categories/{id}
Response: CategoryResponse
```

#### Get Category by Slug
```
GET /api/v1/categories/slug/{slug}
Response: CategoryResponse
```

#### Get Child Categories
```
GET /api/v1/categories/parent/{parentId}
Response: List<CategoryResponse>
```

#### Create Category
```
POST /api/v1/categories
Body: CategoryResponse
Response: CategoryResponse (Status: 201)
```

#### Update Category
```
PUT /api/v1/categories/{id}
Body: CategoryResponse
Response: CategoryResponse
```

#### Delete Category
```
DELETE /api/v1/categories/{id}
Response: No Content (204)
```

### Product Variants

#### Get All Variants for Product
```
GET /api/v1/products/{productId}/variants
Response: List<ProductVariantDTO>
```

#### Get Variant by ID
```
GET /api/v1/products/{productId}/variants/{variantId}
Response: ProductVariantDTO
```

#### Get Variant by SKU
```
GET /api/v1/products/{productId}/variants/sku/{sku}
Response: ProductVariantDTO
```

#### Get Variants by Size
```
GET /api/v1/products/{productId}/variants/size/{size}
Response: List<ProductVariantDTO>
```

#### Get Variants by Color
```
GET /api/v1/products/{productId}/variants/color/{colorName}
Response: List<ProductVariantDTO>
```

#### Create Variant
```
POST /api/v1/products/{productId}/variants
Body: ProductVariantDTO
Response: ProductVariantDTO (Status: 201)
```

#### Update Variant
```
PUT /api/v1/products/{productId}/variants/{variantId}
Body: ProductVariantDTO
Response: ProductVariantDTO
```

#### Delete Variant
```
DELETE /api/v1/products/{productId}/variants/{variantId}
Response: No Content (204)
```

#### Update Stock
```
PATCH /api/v1/products/{productId}/variants/{variantId}/stock
Parameters:
  - quantity (required)
Response: ProductVariantDTO
```

## DTOs

### ProductResponse
```json
{
  "id": 1,
  "name": "Product Name",
  "slug": "product-slug",
  "description": "Product description",
  "categoryId": 1,
  "basePrice": 99.99,
  "images": ["url1", "url2"]
}
```

### ProductCreateRequest
```json
{
  "name": "Product Name",
  "slug": "product-slug",
  "skuRoot": "SKU123",
  "categoryId": 1,
  "brand": "Brand Name",
  "basePrice": 99.99,
  "originalPrice": 119.99,
  "descriptionHighlights": "Highlights",
  "descriptionMaterial": "Material info",
  "descriptionFit": "Fit info",
  "descriptionCare": "Care instructions"
}
```

### ProductDetailResponse
```json
{
  "id": 1,
  "name": "Product Name",
  "slug": "product-slug",
  "skuRoot": "SKU123",
  "brand": "Brand Name",
  "basePrice": 99.99,
  "originalPrice": 119.99,
  "descriptionHighlights": "Highlights",
  "descriptionMaterial": "Material info",
  "descriptionFit": "Fit info",
  "descriptionCare": "Care instructions",
  "isActive": true,
  "categoryId": 1,
  "categoryName": "Category Name",
  "images": ["url1", "url2"],
  "variants": [...],
  "createdAt": "2024-01-01T12:00:00",
  "updatedAt": "2024-01-02T12:00:00"
}
```

### ProductVariantDTO
```json
{
  "id": 1,
  "sku": "SKU123-RED-S",
  "size": "S",
  "color": "Red",
  "stock": 50,
  "price": 99.99,
  "status": "ACTIVE"
}
```

### CategoryResponse
```json
{
  "id": 1,
  "name": "Category Name",
  "slug": "category-slug",
  "isActive": true,
  "sortOrder": 0,
  "parentId": null,
  "children": [...],
  "createdAt": "2024-01-01T12:00:00"
}
```

## Services

### ProductService (ProductServiceImpl)
- getProductById(Long id)
- getProductBySlug(String slug)
- searchProducts(String keyword, Pageable pageable)
- getProductsByCategory(Long categoryId, Pageable pageable)
- getAllActiveProducts(Pageable pageable)
- createProduct(Product product)
- updateProduct(Long id, Product productDetails)
- deleteProduct(Long id)
- toggleProductStatus(Long id)

### CategoryService (CategoryServiceImpl)
- getAllCategories()
- getCategoryById(Long id)
- getCategoryBySlug(String slug)
- getChildCategories(Long parentId)
- createCategory(CategoryResponse categoryDTO)
- updateCategory(Long id, CategoryResponse categoryDTO)
- deleteCategory(Long id)

### ProductVariantService (ProductVariantServiceImpl)
- getVariantsByProductId(Long productId)
- getVariantById(Long variantId)
- getVariantBySku(String sku)
- getVariantsBySize(Long productId, String size)
- getVariantsByColor(Long productId, String colorName)
- createVariant(Long productId, ProductVariantDTO variantDTO)
- updateVariant(Long variantId, ProductVariantDTO variantDTO)
- deleteVariant(Long variantId)
- updateStock(Long variantId, Integer quantity)

## Error Handling
- 400 Bad Request: Invalid parameters or validation failures
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server-side errors

## CORS Configuration
All endpoints are configured with CORS allowed for all origins.
