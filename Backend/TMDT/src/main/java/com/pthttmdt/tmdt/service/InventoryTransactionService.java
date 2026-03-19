package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.entity.InventoryTransaction;
import com.pthttmdt.tmdt.entity.enums.TransactionType;
import com.pthttmdt.tmdt.repository.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryTransactionService {
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public List<InventoryTransaction> getAll() {
        return inventoryTransactionRepository.findAll();
    }

    public InventoryTransaction getById(Long id) {
        return inventoryTransactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory transaction not found with id: " + id));
    }

    public Optional<InventoryTransaction> getByCode(String transactionCode) {
        return inventoryTransactionRepository.findByTransactionCode(transactionCode);
    }

    public List<InventoryTransaction> getByType(TransactionType type) {
        return inventoryTransactionRepository.findByTypeOrderByCreatedAtDesc(type);
    }

    public InventoryTransaction save(InventoryTransaction transaction) {
        return inventoryTransactionRepository.save(transaction);
    }

    public void delete(Long id) {
        inventoryTransactionRepository.deleteById(id);
    }
}
