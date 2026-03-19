package com.pthttmdt.tmdt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDto {
    private Long id;
    private String name;
    private String phone;
    private String address;
    private String taxCode;
    private Boolean status;
}
