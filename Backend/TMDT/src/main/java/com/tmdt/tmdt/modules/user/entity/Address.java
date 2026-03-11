package com.tmdt.tmdt.modules.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name ="addresses",
        indexes = {
                @Index(name = "idx_address_user", columnList = "user_id"),
                @Index(name = "idx_address_user_default", columnList = "user_id,is_default")
        })
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Address {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK tới users
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String receiverName;

    @Column(nullable = false, length = 20)
    private String receiverPhone;

    @Column(nullable = false, length = 255)
    private String line1;

    @Column(nullable = false, length = 150)
    private String ward;

    @Column(nullable = false, length = 150)
    private String district;

    @Column(nullable = false, length = 150)
    private String city;

    @Column(nullable = false, length = 150)
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AddressType addressType = AddressType.HOME;

    @Column(name="is_default", nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
