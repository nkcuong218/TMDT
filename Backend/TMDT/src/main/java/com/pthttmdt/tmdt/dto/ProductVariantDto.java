package com.pthttmdt.tmdt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantDto {
    private Long id;
    private Long productId;
    private String sku;
    private String color;
    private String size;
    private Integer stock;
    private BigDecimal priceOverride;
}
