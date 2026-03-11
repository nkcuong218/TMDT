package com.tmdt.tmdt.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name ="categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Tên hiển thị
    @Column(nullable = false, length = 150)
    private String name;
    // URL SEO
    @Column(nullable = false, unique = true, length = 160)
    private String slug;

    @ManyToOne
    @JoinColumn(name= "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Category> children;
    // Ẩn hiện danh mục
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    // Thứ tự hiển thị
    @Builder.Default
    private Integer sortOrder = 0;
    // Thời điểm tạo
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
