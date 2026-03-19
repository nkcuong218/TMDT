package com.pthttmdt.tmdt.dto;

import com.pthttmdt.tmdt.entity.enums.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class InventoryVariantHistoryDto {
    private Long itemId;
    private Long transactionId;
    private String transactionCode;
    private TransactionType transactionType;
    private Integer quantity;
    private BigDecimal unitPrice;
    private String locationCode;
    private LocalDateTime createdAt;
}
