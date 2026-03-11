package com.tmdt.tmdt.modules.catalog.service;

import com.tmdt.tmdt.modules.catalog.dto.CategoryResponse;
import java.util.List;

public interface CategoryService {
    /**
     * Lấy tất cả danh mục
     */
    List<CategoryResponse> getAllCategories();

    /**
     * Lấy danh mục theo ID
     */
    CategoryResponse getCategoryById(Long id);

    /**
     * Lấy danh mục theo slug
     */
    CategoryResponse getCategoryBySlug(String slug);

    /**
     * Lấy danh mục con theo ID danh mục cha
     */
    List<CategoryResponse> getChildCategories(Long parentId);

    /**
     * Tạo danh mục mới
     */
    CategoryResponse createCategory(CategoryResponse categoryDTO);

    /**
     * Cập nhật danh mục
     */
    CategoryResponse updateCategory(Long id, CategoryResponse categoryDTO);

    /**
     * Xóa danh mục
     */
    void deleteCategory(Long id);
}
