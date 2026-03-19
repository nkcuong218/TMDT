package com.pthttmdt.tmdt.entity;

import com.pthttmdt.tmdt.entity.enums.AddressType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String recipientName;
    private String recipientPhone;
    private String streetAddress;
    private String city;
    private String district;

    @Enumerated(EnumType.STRING)
    private AddressType addressType;

    private Boolean isDefault;
}
