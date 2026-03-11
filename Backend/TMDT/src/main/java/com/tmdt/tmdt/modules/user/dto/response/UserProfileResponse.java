package com.tmdt.tmdt.modules.user.dto.response;

public record UserProfileResponse(
        Long id,
        String firstName,
        String lastName,
        String fullName,
        String email,
        String phone,
        String role,
        String status
) {
}
