package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.entity.User;
import com.pthttmdt.tmdt.entity.enums.RoleType;
import com.pthttmdt.tmdt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    public Optional<User> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getByRole(RoleType role) {
        return userRepository.findByRole(role);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
