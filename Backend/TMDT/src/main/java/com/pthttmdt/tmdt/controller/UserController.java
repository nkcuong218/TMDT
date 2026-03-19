package com.pthttmdt.tmdt.controller;

import com.pthttmdt.tmdt.dto.UserDto;
import com.pthttmdt.tmdt.entity.User;
import com.pthttmdt.tmdt.entity.enums.RoleType;
import com.pthttmdt.tmdt.mapper.UserMapper;
import com.pthttmdt.tmdt.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping
    public List<UserDto> getAll() {
        return userService.getAll().stream().map(userMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public UserDto getById(@PathVariable Long id) {
        try {
            return userMapper.toDto(userService.getById(id));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getByEmail(@PathVariable String email) {
        return userService.getByEmail(email)
                .map(userMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    public List<UserDto> getByRole(@PathVariable RoleType role) {
        return userService.getByRole(role).stream().map(userMapper::toDto).toList();
    }

    @GetMapping("/exists")
    public Map<String, Boolean> existsByEmail(@RequestParam String email) {
        return Map.of("exists", userService.existsByEmail(email));
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody UserDto dto) {
        User saved = userService.save(userMapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public UserDto update(@PathVariable Long id, @RequestBody UserDto dto) {
        dto.setId(id);
        User saved = userService.save(userMapper.toEntity(dto));
        return userMapper.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
