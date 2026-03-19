package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.entity.Voucher;
import com.pthttmdt.tmdt.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoucherService {
    private final VoucherRepository voucherRepository;

    public List<Voucher> getAll() {
        return voucherRepository.findAll();
    }

    public List<Voucher> getAllActive() {
        return voucherRepository.findByIsActiveTrue();
    }

    public Voucher getById(Long id) {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voucher not found with id: " + id));
    }

    public Optional<Voucher> getByCode(String code) {
        return voucherRepository.findByCode(code);
    }

    public Optional<Voucher> getActiveByCode(String code) {
        return voucherRepository.findByCodeAndIsActiveTrue(code);
    }

    public Voucher save(Voucher voucher) {
        return voucherRepository.save(voucher);
    }

    public void delete(Long id) {
        voucherRepository.deleteById(id);
    }
}
