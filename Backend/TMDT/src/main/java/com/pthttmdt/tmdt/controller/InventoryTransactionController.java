package com.pthttmdt.tmdt.controller;

import com.pthttmdt.tmdt.dto.InventoryTransactionDto;
import com.pthttmdt.tmdt.dto.InventoryVariantHistoryDto;
import com.pthttmdt.tmdt.entity.InventoryTransaction;
import com.pthttmdt.tmdt.entity.enums.TransactionType;
import com.pthttmdt.tmdt.mapper.InventoryTransactionMapper;
import com.pthttmdt.tmdt.service.InventoryHistoryService;
import com.pthttmdt.tmdt.service.InventoryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/inventory-transactions")
@RequiredArgsConstructor
public class InventoryTransactionController {
    private final InventoryTransactionService inventoryTransactionService;
    private final InventoryTransactionMapper inventoryTransactionMapper;
    private final InventoryHistoryService inventoryHistoryService;

    @GetMapping
    public List<InventoryTransactionDto> getAll() {
        return inventoryTransactionService.getAll().stream().map(inventoryTransactionMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public InventoryTransactionDto getById(@PathVariable Long id) {
        try {
            return inventoryTransactionMapper.toDto(inventoryTransactionService.getById(id));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/code/{transactionCode}")
    public ResponseEntity<InventoryTransactionDto> getByCode(@PathVariable String transactionCode) {
        return inventoryTransactionService.getByCode(transactionCode)
                .map(inventoryTransactionMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public List<InventoryTransactionDto> getByType(@PathVariable TransactionType type) {
        return inventoryTransactionService.getByType(type).stream().map(inventoryTransactionMapper::toDto).toList();
    }

    @GetMapping("/variant/{variantId}/history")
    public List<InventoryVariantHistoryDto> getVariantHistory(@PathVariable Long variantId) {
        return inventoryHistoryService.getByVariantId(variantId);
    }

    @PostMapping
    public ResponseEntity<InventoryTransactionDto> create(@RequestBody InventoryTransactionDto dto) {
        InventoryTransaction saved = inventoryTransactionService.save(inventoryTransactionMapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryTransactionMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public InventoryTransactionDto update(@PathVariable Long id, @RequestBody InventoryTransactionDto dto) {
        dto.setId(id);
        InventoryTransaction saved = inventoryTransactionService.save(inventoryTransactionMapper.toEntity(dto));
        return inventoryTransactionMapper.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryTransactionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
