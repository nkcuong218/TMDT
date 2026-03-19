package com.pthttmdt.tmdt.mapper;

import com.pthttmdt.tmdt.dto.UserDto;
import com.pthttmdt.tmdt.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserDto toDto(User entity) {
        if (entity == null) {
            return null;
        }

        return UserDto.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .phone(entity.getPhone())
                .avatarUrl(entity.getAvatarUrl())
                .status(entity.getStatus())
                .role(entity.getRole())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public User toEntity(UserDto dto) {
        if (dto == null) {
            return null;
        }

        User entity = new User();
        entity.setId(dto.getId());
        entity.setEmail(dto.getEmail());
        entity.setFullName(dto.getFullName());
        entity.setPhone(dto.getPhone());
        entity.setAvatarUrl(dto.getAvatarUrl());
        entity.setStatus(dto.getStatus());
        entity.setRole(dto.getRole());
        entity.setCreatedAt(dto.getCreatedAt());
        return entity;
    }
}
