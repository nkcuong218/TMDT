package com.tmdt.tmdt.modules.user.repository;

import com.tmdt.tmdt.modules.user.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUser_IdOrderByIsDefaultDescCreatedAtDesc(Long userId);
    Optional<Address> findByIdAndUser_Id(Long id, Long userId);
    Optional<Address> findByUser_IdAndIsDefaultTrue(Long userId);

}
