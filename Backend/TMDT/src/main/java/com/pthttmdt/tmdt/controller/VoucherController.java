package com.pthttmdt.tmdt.controller;

import com.pthttmdt.tmdt.dto.VoucherDto;
import com.pthttmdt.tmdt.entity.Voucher;
import com.pthttmdt.tmdt.mapper.VoucherMapper;
import com.pthttmdt.tmdt.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;
    private final VoucherMapper voucherMapper;

    @GetMapping
    public List<VoucherDto> getAll() {
        return voucherService.getAll().stream().map(voucherMapper::toDto).toList();
    }

    @GetMapping("/active")
    public List<VoucherDto> getAllActive() {
        return voucherService.getAllActive().stream().map(voucherMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public VoucherDto getById(@PathVariable Long id) {
        try {
            return voucherMapper.toDto(voucherService.getById(id));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<VoucherDto> getByCode(@PathVariable String code) {
        return voucherService.getByCode(code)
                .map(voucherMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/active/code/{code}")
    public ResponseEntity<VoucherDto> getActiveByCode(@PathVariable String code) {
        return voucherService.getActiveByCode(code)
                .map(voucherMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<VoucherDto> create(@RequestBody VoucherDto dto) {
        Voucher saved = voucherService.save(voucherMapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(voucherMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public VoucherDto update(@PathVariable Long id, @RequestBody VoucherDto dto) {
        dto.setId(id);
        Voucher saved = voucherService.save(voucherMapper.toEntity(dto));
        return voucherMapper.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        voucherService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
