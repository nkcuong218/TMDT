package com.tmdt.tmdt.modules.user.controller;

import com.tmdt.tmdt.modules.user.dto.request.LoginRequest;
import com.tmdt.tmdt.modules.user.dto.request.RegisterRequest;
import com.tmdt.tmdt.modules.user.dto.response.AuthResponse;
import com.tmdt.tmdt.modules.user.dto.response.UserProfileResponse;
import com.tmdt.tmdt.modules.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@RequestParam Long userId) {
        return ResponseEntity.ok(authService.getProfile(userId));
    }
}
