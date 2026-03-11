
package com.tmdt.tmdt.modules.user.repository;

import com.tmdt.tmdt.modules.user.entity.User;
import com.tmdt.tmdt.modules.user.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailOrPhone(String email, String phone);
    List<User> findByRoleOrderByCreatedAtDesc(UserRole role);
    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
