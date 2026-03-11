package com.tmdt.tmdt.modules.user.service;

import com.tmdt.tmdt.modules.user.dto.request.LoginRequest;
import com.tmdt.tmdt.modules.user.dto.request.RegisterRequest;
import com.tmdt.tmdt.modules.user.dto.response.AuthResponse;
import com.tmdt.tmdt.modules.user.dto.response.UserProfileResponse;
import com.tmdt.tmdt.modules.user.entity.AccountStatus;
import com.tmdt.tmdt.modules.user.entity.User;
import com.tmdt.tmdt.modules.user.entity.UserRole;
import com.tmdt.tmdt.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email da ton tai");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("So dien thoai da ton tai");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .status(AccountStatus.ACTIVE)
                .role(UserRole.CUSTOMER)
                .build();

        return toAuthResponse(userRepository.save(user));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailOrPhone(request.getIdentifier(), request.getIdentifier())
                .orElseThrow(() -> new RuntimeException("Tai khoan hoac mat khau khong dung"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Tai khoan hoac mat khau khong dung");
        }

        if (user.getStatus() == AccountStatus.BLOCKED) {
            throw new RuntimeException("Tai khoan da bi khoa");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        return toAuthResponse(user);
    }

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nguoi dung voi id: " + userId));

        return new UserProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                fullName(user),
                user.getEmail(),
                user.getPhone(),
                toRoleName(user),
                toStatusName(user.getStatus())
        );
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(
                user.getId(),
                fullName(user),
                user.getEmail(),
                user.getPhone(),
                toRoleName(user),
                toStatusName(user.getStatus()),
                "mock-token-" + user.getId() + "-" + System.currentTimeMillis()
        );
    }

    private String toRoleName(User user) {
        return user.getRole() == UserRole.ADMIN ? "admin" : "customer";
    }

    private String toStatusName(AccountStatus status) {
        return switch (status) {
            case ACTIVE -> "Active";
            case BLOCKED -> "Blocked";
            case PENDING_VERIFY -> "Pending";
        };
    }

    private String fullName(User user) {
        return (user.getLastName() + " " + user.getFirstName()).trim();
    }
}
