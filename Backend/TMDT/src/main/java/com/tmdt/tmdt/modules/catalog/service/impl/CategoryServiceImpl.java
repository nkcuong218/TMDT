package com.tmdt.tmdt.modules.catalog.service.impl;

import com.tmdt.tmdt.modules.catalog.dto.CategoryResponse;
import com.tmdt.tmdt.modules.catalog.entity.Category;
import com.tmdt.tmdt.modules.catalog.mapper.CategoryMapper;
import com.tmdt.tmdt.modules.catalog.repository.CategoryRepository;
import com.tmdt.tmdt.modules.catalog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findByIsActiveTrueOrderBySortOrderAsc();
        // Chỉ lấy danh mục cấp 1 (parent_id = null)
        return categories.stream()
                .filter(c -> c.getParent() == null)
                .map(categoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found with slug: " + slug));
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    public List<CategoryResponse> getChildCategories(Long parentId) {
        List<Category> categories = categoryRepository.findByParentIdAndIsActiveTrue(parentId);
        return categories.stream()
                .map(categoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryResponse categoryDTO) {
        Category category = categoryMapper.toCategory(categoryDTO);
        
        // Nếu có parentId, tìm danh mục cha
        if (categoryDTO.parentId() != null) {
            Category parent = categoryRepository.findById(categoryDTO.parentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found with id: " + categoryDTO.parentId()));
            category.setParent(parent);
        }

        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryResponse categoryDTO) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        category.setName(categoryDTO.name());
        category.setSlug(categoryDTO.slug());
        category.setIsActive(categoryDTO.isActive());
        category.setSortOrder(categoryDTO.sortOrder());

        // Cập nhật danh mục cha nếu cần
        if (categoryDTO.parentId() != null) {
            Category parent = categoryRepository.findById(categoryDTO.parentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found with id: " + categoryDTO.parentId()));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        Category updatedCategory = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
