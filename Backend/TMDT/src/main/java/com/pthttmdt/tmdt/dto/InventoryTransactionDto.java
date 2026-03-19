package com.pthttmdt.tmdt.dto;

import com.pthttmdt.tmdt.entity.enums.TransactionType;
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
public class InventoryTransactionDto {
    private Long id;
    private String transactionCode;
    private TransactionType type;
    private Long supplierId;
    private String source;
    private String qualityStatus;
    private String storageNote;
    private BigDecimal totalAmount;
    private Long createdById;
    private LocalDateTime createdAt;
}
