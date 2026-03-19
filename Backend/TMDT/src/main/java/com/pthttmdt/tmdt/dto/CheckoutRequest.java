package com.pthttmdt.tmdt.dto;

import com.pthttmdt.tmdt.entity.enums.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CheckoutRequest {
    private String recipientName;
    private String recipientPhone;
    private String streetAddress;
    private String city;
    private String district;
    private String note;
    private PaymentMethod paymentMethod;
    private String voucherCode;
    private BigDecimal shippingFee;
    private Boolean saveAsDefaultAddress;
}
