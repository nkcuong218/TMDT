package com.pthttmdt.tmdt.repository;

import com.pthttmdt.tmdt.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
	Optional<Voucher> findByCode(String code);

	Optional<Voucher> findByCodeAndIsActiveTrue(String code);

	List<Voucher> findByIsActiveTrue();
}
