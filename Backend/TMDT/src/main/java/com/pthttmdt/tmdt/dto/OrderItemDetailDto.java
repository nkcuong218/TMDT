package com.pthttmdt.tmdt.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemDetailDto {
    private Long id;
    private Long productVariantId;
    private String productName;
    private String sku;
    private String color;
    private String size;
    private BigDecimal price;
    private Integer quantity;
}
