package com.pthttmdt.tmdt.dto;

import com.pthttmdt.tmdt.entity.enums.VoucherType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherDto {
    private Long id;
    private String code;
    private VoucherType type;
    private BigDecimal discountAmount;
    private BigDecimal minOrderValue;
    private String description;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private Boolean isActive;
}
