package com.tmdt.tmdt.modules.user.dto.response;

public record AuthResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String role,
        String status,
        String token
) {
}
