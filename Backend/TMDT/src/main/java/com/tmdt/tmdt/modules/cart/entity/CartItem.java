package com.tmdt.tmdt.modules.cart.entity;
import com.tmdt.tmdt.modules.catalog.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"cart_id", "product_variant_id"})
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Thuộc giỏ nào
    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    // Biến thể sản phẩm được chọn
    @ManyToOne
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    // Số lượng
    @Column(nullable = false)
    private Integer quantity;

    // Snapshot giá tại thời điểm thêm giỏ
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPriceSnapshot;
}
