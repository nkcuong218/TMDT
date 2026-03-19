package com.pthttmdt.tmdt.repository;

import com.pthttmdt.tmdt.entity.InventoryTransaction;
import com.pthttmdt.tmdt.entity.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
	Optional<InventoryTransaction> findByTransactionCode(String transactionCode);

	List<InventoryTransaction> findByTypeOrderByCreatedAtDesc(TransactionType type);
}
