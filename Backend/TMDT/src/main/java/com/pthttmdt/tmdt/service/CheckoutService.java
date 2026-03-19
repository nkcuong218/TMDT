package com.pthttmdt.tmdt.service;

import com.pthttmdt.tmdt.dto.CheckoutRequest;
import com.pthttmdt.tmdt.entity.*;
import com.pthttmdt.tmdt.entity.enums.AddressType;
import com.pthttmdt.tmdt.entity.enums.OrderStatus;
import com.pthttmdt.tmdt.entity.enums.PaymentStatus;
import com.pthttmdt.tmdt.entity.enums.TransactionType;
import com.pthttmdt.tmdt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final VoucherRepository voucherRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryTransactionItemRepository inventoryTransactionItemRepository;
    private final UserAddressRepository userAddressRepository;

    @Transactional
    public Order checkout(User user, CheckoutRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }

        validateAddress(request);

        BigDecimal subTotal = BigDecimal.ZERO;
        List<ProductVariant> variantsToUpdate = new ArrayList<>();
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            ProductVariant variant = productVariantRepository.findById(cartItem.getProductVariant().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product variant not found"));

            int quantity = cartItem.getQuantity() == null ? 0 : cartItem.getQuantity();
            if (quantity <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid cart item quantity");
            }

            int stock = variant.getStock() == null ? 0 : variant.getStock();
            if (stock < quantity) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Insufficient stock for SKU " + variant.getSku());
            }

            BigDecimal unitPrice = resolveUnitPrice(variant);
            subTotal = subTotal.add(unitPrice.multiply(BigDecimal.valueOf(quantity)));

            variant.setStock(stock - quantity);
            variantsToUpdate.add(variant);

            OrderItem item = OrderItem.builder()
                    .productVariant(variant)
                    .productName(variant.getProduct().getName())
                    .sku(variant.getSku())
                    .color(variant.getColor())
                    .size(variant.getSize())
                    .price(unitPrice)
                    .quantity(quantity)
                    .build();
            orderItems.add(item);
        }

        BigDecimal shippingFee = request.getShippingFee() == null ? BigDecimal.ZERO : request.getShippingFee();
        BigDecimal discountAmount = validateAndComputeDiscount(request.getVoucherCode(), subTotal, shippingFee);
        BigDecimal totalAmount = subTotal.add(shippingFee).subtract(discountAmount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        Order order = Order.builder()
                .code("ORD-" + System.currentTimeMillis())
                .user(user)
                .customerName(request.getRecipientName())
                .customerPhone(request.getRecipientPhone())
                .customerEmail(user.getEmail())
                .shippingAddress(formatAddress(request))
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .status(OrderStatus.PENDING)
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .subTotal(subTotal)
                .totalAmount(totalAmount)
                .build();

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
        }
        orderItemRepository.saveAll(orderItems);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(savedOrder)
                .status(OrderStatus.PENDING)
                .note("Order created")
                .changedBy(user)
                .build();
        orderStatusHistoryRepository.save(history);

        InventoryTransaction transaction = InventoryTransaction.builder()
                .transactionCode("EXP-" + System.currentTimeMillis())
                .type(TransactionType.EXPORT)
                .source("ORDER:" + savedOrder.getCode())
                .qualityStatus("READY")
                .storageNote("Auto export from checkout")
                .createdBy(user)
                .totalAmount(totalAmount)
                .build();

        InventoryTransaction savedTransaction = inventoryTransactionRepository.save(transaction);

        List<InventoryTransactionItem> txItems = new ArrayList<>();
        for (OrderItem item : orderItems) {
            InventoryTransactionItem txItem = InventoryTransactionItem.builder()
                    .transaction(savedTransaction)
                    .productVariant(item.getProductVariant())
                    .locationCode("MAIN")
                    .quantity(item.getQuantity())
                    .unitPrice(item.getPrice())
                    .build();
            txItems.add(txItem);
        }
        inventoryTransactionItemRepository.saveAll(txItems);

        productVariantRepository.saveAll(variantsToUpdate);
        cartItemRepository.deleteByUserId(user.getId());

        saveAddress(user, request);
        return savedOrder;
    }

    private void validateAddress(CheckoutRequest request) {
        if (request.getRecipientName() == null || request.getRecipientName().isBlank()
                || request.getRecipientPhone() == null || request.getRecipientPhone().isBlank()
                || request.getStreetAddress() == null || request.getStreetAddress().isBlank()
                || request.getCity() == null || request.getCity().isBlank()
                || request.getDistrict() == null || request.getDistrict().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shipping address is required");
        }

        if (request.getPaymentMethod() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment method is required");
        }
    }

    private String formatAddress(CheckoutRequest request) {
        return request.getStreetAddress() + ", " + request.getDistrict() + ", " + request.getCity();
    }

    private BigDecimal resolveUnitPrice(ProductVariant variant) {
        if (variant.getPriceOverride() != null) {
            return variant.getPriceOverride();
        }
        if (variant.getProduct() != null && variant.getProduct().getBasePrice() != null) {
            return variant.getProduct().getBasePrice();
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Variant price is missing for SKU " + variant.getSku());
    }

    private BigDecimal validateAndComputeDiscount(String voucherCode, BigDecimal subTotal, BigDecimal shippingFee) {
        if (voucherCode == null || voucherCode.isBlank()) {
            return BigDecimal.ZERO;
        }

        Voucher voucher = voucherRepository.findByCodeAndIsActiveTrue(voucherCode.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Voucher is invalid or inactive"));

        LocalDateTime now = LocalDateTime.now();
        if ((voucher.getValidFrom() != null && now.isBefore(voucher.getValidFrom()))
                || (voucher.getValidUntil() != null && now.isAfter(voucher.getValidUntil()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Voucher is not in valid date range");
        }

        if (voucher.getMinOrderValue() != null && subTotal.compareTo(voucher.getMinOrderValue()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order does not meet voucher minimum value");
        }

        BigDecimal rawDiscount = voucher.getDiscountAmount() == null ? BigDecimal.ZERO : voucher.getDiscountAmount();
        if (voucher.getType() == null) {
            return BigDecimal.ZERO;
        }
        if (voucher.getType().name().equals("ORDER")) {
            return rawDiscount.min(subTotal);
        }
        return rawDiscount.min(shippingFee);
    }

    private void saveAddress(User user, CheckoutRequest request) {
        if (Boolean.TRUE.equals(request.getSaveAsDefaultAddress())) {
            userAddressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                    .ifPresent(existing -> {
                        existing.setIsDefault(false);
                        userAddressRepository.save(existing);
                    });
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .streetAddress(request.getStreetAddress())
                .city(request.getCity())
                .district(request.getDistrict())
                .addressType(AddressType.HOME)
                .isDefault(Boolean.TRUE.equals(request.getSaveAsDefaultAddress()))
                .build();
        userAddressRepository.save(address);
    }
}
