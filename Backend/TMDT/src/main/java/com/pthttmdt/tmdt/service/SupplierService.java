package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.entity.Supplier;
import com.pthttmdt.tmdt.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;

    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    public List<Supplier> getAllActive() {
        return supplierRepository.findByStatusTrue();
    }

    public Supplier getById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found with id: " + id));
    }

    public Supplier save(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public void delete(Long id) {
        supplierRepository.deleteById(id);
    }
}
