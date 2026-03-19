package com.pthttmdt.tmdt.repository;

import com.pthttmdt.tmdt.entity.User;
import com.pthttmdt.tmdt.entity.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	List<User> findByRole(RoleType role);
}
