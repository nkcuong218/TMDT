package com.pthttmdt.tmdt.dto.auth;

import com.pthttmdt.tmdt.entity.enums.RoleType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private Long id;
    private String email;
    private String fullName;
    private RoleType role;
    private String token;
}
