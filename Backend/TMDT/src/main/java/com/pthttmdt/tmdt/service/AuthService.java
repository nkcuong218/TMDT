package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.dto.auth.AuthResponse;
import com.pthttmdt.tmdt.dto.auth.LoginRequest;
import com.pthttmdt.tmdt.dto.auth.RegisterRequest;
import com.pthttmdt.tmdt.entity.User;
import com.pthttmdt.tmdt.entity.enums.RoleType;
import com.pthttmdt.tmdt.entity.enums.UserStatus;
import com.pthttmdt.tmdt.repository.UserRepository;
import com.pthttmdt.tmdt.security.AppUserDetailsService;
import com.pthttmdt.tmdt.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AppUserDetailsService appUserDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank() || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
            .avatarUrl(normalizeAvatarUrl(request.getAvatarUrl()))
                .status(UserStatus.ACTIVE)
                .role(RoleType.CUSTOMER)
                .build();

        User saved = userRepository.save(user);
        UserDetails userDetails = appUserDetailsService.loadUserByUsername(saved.getEmail());
        String token = jwtService.generateToken(userDetails, Map.of(
                "uid", saved.getId(),
                "role", saved.getRole().name()
        ));

        return toAuthResponse(saved, token);
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (user.getStatus() == UserStatus.BLOCKED || user.getStatus() == UserStatus.INACTIVE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not active");
        }

        UserDetails userDetails = appUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails, Map.of(
                "uid", user.getId(),
                "role", user.getRole().name()
        ));

        return toAuthResponse(user, token);
    }

    public AuthResponse me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toAuthResponse(user, null);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .token(token)
                .build();
    }

    private String normalizeAvatarUrl(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isBlank()) {
            return null;
        }
        return avatarUrl.trim();
    }
}
