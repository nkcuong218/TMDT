package com.pthttmdt.tmdt.repository;

import com.pthttmdt.tmdt.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import java.util.List;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findByUserIdOrderByIsDefaultDesc(Long userId);
    Optional<UserAddress> findByUserIdAndIsDefaultTrue(Long userId);
}
