package com.tmdt.tmdt.config;

import com.tmdt.tmdt.modules.catalog.entity.Category;
import com.tmdt.tmdt.modules.catalog.entity.Product;
import com.tmdt.tmdt.modules.catalog.entity.ProductImage;
import com.tmdt.tmdt.modules.catalog.entity.ProductVariant;
import com.tmdt.tmdt.modules.catalog.entity.VariantStatus;
import com.tmdt.tmdt.modules.catalog.repository.CategoryRepository;
import com.tmdt.tmdt.modules.catalog.repository.ProductImageRepository;
import com.tmdt.tmdt.modules.catalog.repository.ProductRepository;
import com.tmdt.tmdt.modules.catalog.repository.ProductVariantRepository;
import com.tmdt.tmdt.modules.user.entity.AccountStatus;
import com.tmdt.tmdt.modules.user.entity.User;
import com.tmdt.tmdt.modules.user.entity.UserRole;
import com.tmdt.tmdt.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            // Chỉ seed nếu database trống
            if (categoryRepository.count() > 0) {
                System.out.println("Database already has data, skipping seeding...");
                return;
            }

            System.out.println("Seeding database with sample data...");

            // Tạo Categories
            Category menCategory = Category.builder()
                    .name("Thời trang Nam")
                    .slug("thoi-trang-nam")
                    .isActive(true)
                    .sortOrder(1)
                    .createdAt(LocalDateTime.now())
                    .build();
            categoryRepository.save(menCategory);

            Category womenCategory = Category.builder()
                    .name("Thời trang Nữ")
                    .slug("thoi-trang-nu")
                    .isActive(true)
                    .sortOrder(2)
                    .createdAt(LocalDateTime.now())
                    .build();
            categoryRepository.save(womenCategory);

            Category kidsCategory = Category.builder()
                    .name("Thời trang Trẻ em")
                    .slug("thoi-trang-tre-em")
                    .isActive(true)
                    .sortOrder(3)
                    .createdAt(LocalDateTime.now())
                    .build();
            categoryRepository.save(kidsCategory);

            // Tạo Products
            Product aoThunNam = Product.builder()
                    .name("Áo Thun Nam Basic")
                    .slug("ao-thun-nam-basic")
                    .skuRoot("ATN001")
                    .category(menCategory)
                    .brand("5S Fashion")
                    .basePrice(new BigDecimal("199000"))
                    .originalPrice(new BigDecimal("250000"))
                    .descriptionHighlights("Áo thun nam chất liệu cotton 100% thoáng mát")
                    .descriptionMaterial("Cotton 100%")
                    .descriptionFit("Form regular fit")
                    .descriptionCare("Giặt máy, không tẩy")
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            productRepository.save(aoThunNam);

            // Tạo Variants cho Áo Thun Nam
            ProductVariant variant1 = ProductVariant.builder()
                    .product(aoThunNam)
                    .sku("ATN001-WHITE-M")
                    .colorName("Trắng")
                    .colorCode("#FFFFFF")
                    .size("M")
                    .stockQuantity(50)
                    .status(VariantStatus.ACTIVE)
                    .createdAt(LocalDateTime.now())
                    .build();
            productVariantRepository.save(variant1);

            ProductVariant variant2 = ProductVariant.builder()
                    .product(aoThunNam)
                    .sku("ATN001-BLACK-M")
                    .colorName("Đen")
                    .colorCode("#000000")
                    .size("M")
                    .stockQuantity(50)
                    .status(VariantStatus.ACTIVE)
                    .createdAt(LocalDateTime.now())
                    .build();
            productVariantRepository.save(variant2);

            // Tạo Images
            ProductImage img1 = ProductImage.builder()
                    .product(aoThunNam)
                    .imageUrl("https://via.placeholder.com/500?text=Ao+Thun+Nam")
                    .isPrimary(true)
                    .sortOrder(1)
                    .altText("Áo thun nam basic")
                    .build();
            productImageRepository.save(img1);

            // Tạo Users
            User admin = User.builder()
                    .email("admin@5sfashion.com")
                    .phone("0999999999")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("System")
                    .status(AccountStatus.ACTIVE)
                    .role(UserRole.ADMIN)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);

            User customer = User.builder()
                    .email("customer@test.com")
                    .phone("0888888888")
                    .passwordHash(passwordEncoder.encode("customer123"))
                    .firstName("Nguyen")
                    .lastName("Van A")
                    .status(AccountStatus.ACTIVE)
                    .role(UserRole.CUSTOMER)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(customer);

            System.out.println("✅ Database seeded successfully!");
            System.out.println("Admin: admin@5sfashion.com / admin123");
            System.out.println("Customer: customer@test.com / customer123");
        };
    }
}
