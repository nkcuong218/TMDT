package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.dto.InventoryVariantHistoryDto;
import com.pthttmdt.tmdt.repository.InventoryTransactionItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryHistoryService {

    private final InventoryTransactionItemRepository inventoryTransactionItemRepository;

    public List<InventoryVariantHistoryDto> getByVariantId(Long productVariantId) {
        return inventoryTransactionItemRepository.findByProductVariantIdOrderByIdDesc(productVariantId)
                .stream()
                .map(item -> InventoryVariantHistoryDto.builder()
                        .itemId(item.getId())
                        .transactionId(item.getTransaction() != null ? item.getTransaction().getId() : null)
                        .transactionCode(item.getTransaction() != null ? item.getTransaction().getTransactionCode() : null)
                        .transactionType(item.getTransaction() != null ? item.getTransaction().getType() : null)
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .locationCode(item.getLocationCode())
                        .createdAt(item.getTransaction() != null ? item.getTransaction().getCreatedAt() : null)
                        .build())
                .toList();
    }
}
