package com.pthttmdt.tmdt.dto;

import com.pthttmdt.tmdt.entity.enums.AddressType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserAddressDto {
    private Long id;
    private String recipientName;
    private String recipientPhone;
    private String streetAddress;
    private String city;
    private String district;
    private AddressType addressType;
    private Boolean isDefault;
}
