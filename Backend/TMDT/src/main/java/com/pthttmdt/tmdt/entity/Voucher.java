package com.pthttmdt.tmdt.entity;

import com.pthttmdt.tmdt.entity.enums.VoucherType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    private VoucherType type;

    private BigDecimal discountAmount;
    private BigDecimal minOrderValue;
    private String description;

    private LocalDateTime validFrom;
    private LocalDateTime validUntil;

    @Builder.Default
    private Boolean isActive = true;
}
