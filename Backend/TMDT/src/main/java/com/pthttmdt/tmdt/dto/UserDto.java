package com.pthttmdt.tmdt.dto;

import com.pthttmdt.tmdt.entity.enums.RoleType;
import com.pthttmdt.tmdt.entity.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private UserStatus status;
    private RoleType role;
    private LocalDateTime createdAt;
}
