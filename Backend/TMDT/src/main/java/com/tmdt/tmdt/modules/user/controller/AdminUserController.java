package com.tmdt.tmdt.modules.user.controller;

import com.tmdt.tmdt.modules.user.dto.response.CustomerDetailResponse;
import com.tmdt.tmdt.modules.user.dto.response.CustomerListItemResponse;
import com.tmdt.tmdt.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<CustomerListItemResponse>> getCustomers(
            @RequestParam(defaultValue = "") String keyword
    ) {
        return ResponseEntity.ok(userService.getCustomers(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDetailResponse> getCustomerDetail(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getCustomerDetail(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CustomerListItemResponse> toggleCustomerStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleCustomerStatus(id));
    }
}
