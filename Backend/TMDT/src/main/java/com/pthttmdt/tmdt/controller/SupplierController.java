package com.pthttmdt.tmdt.controller;

import com.pthttmdt.tmdt.dto.SupplierDto;
import com.pthttmdt.tmdt.entity.Supplier;
import com.pthttmdt.tmdt.mapper.SupplierMapper;
import com.pthttmdt.tmdt.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;
    private final SupplierMapper supplierMapper;

    @GetMapping
    public List<SupplierDto> getAll() {
        return supplierService.getAll().stream().map(supplierMapper::toDto).toList();
    }

    @GetMapping("/active")
    public List<SupplierDto> getAllActive() {
        return supplierService.getAllActive().stream().map(supplierMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public SupplierDto getById(@PathVariable Long id) {
        try {
            return supplierMapper.toDto(supplierService.getById(id));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<SupplierDto> create(@RequestBody SupplierDto dto) {
        Supplier saved = supplierService.save(supplierMapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(supplierMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public SupplierDto update(@PathVariable Long id, @RequestBody SupplierDto dto) {
        dto.setId(id);
        Supplier saved = supplierService.save(supplierMapper.toEntity(dto));
        return supplierMapper.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
