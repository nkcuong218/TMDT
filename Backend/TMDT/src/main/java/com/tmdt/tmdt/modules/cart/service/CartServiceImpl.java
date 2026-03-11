package com.tmdt.tmdt.modules.cart.service;

import com.tmdt.tmdt.modules.cart.dto.AddCartItemRequest;
import com.tmdt.tmdt.modules.cart.dto.CartItemResponse;
import com.tmdt.tmdt.modules.cart.dto.CartResponse;
import com.tmdt.tmdt.modules.cart.entity.Cart;
import com.tmdt.tmdt.modules.cart.entity.CartItem;
import com.tmdt.tmdt.modules.cart.entity.CartStatus;
import com.tmdt.tmdt.modules.cart.repository.CartItemRepository;
import com.tmdt.tmdt.modules.cart.repository.CartRepository;
import com.tmdt.tmdt.modules.catalog.entity.ProductImage;
import com.tmdt.tmdt.modules.catalog.entity.ProductVariant;
import com.tmdt.tmdt.modules.catalog.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
        @Transactional
    public CartResponse getActiveCart(Long userId) {
        Cart cart = getOrCreateActiveCart(userId);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItem(AddCartItemRequest request) {
        Cart cart = getOrCreateActiveCart(request.userId());

        ProductVariant variant = productVariantRepository.findById(request.productVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + request.productVariantId()));

        CartItem item = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                .orElseGet(() -> CartItem.builder()
                        .cart(cart)
                        .productVariant(variant)
                        .quantity(0)
                        .unitPriceSnapshot(resolvePrice(variant))
                        .build());

        item.setQuantity(item.getQuantity() + request.quantity());
        item.setUnitPriceSnapshot(resolvePrice(variant));

        cartItemRepository.save(item);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItemQuantity(Long userId, Long itemId, Integer quantity) {
        Cart cart = getOrCreateActiveCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user cart");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateActiveCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user cart");
        }

        cartItemRepository.delete(item);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse clearCart(Long userId) {
        Cart cart = getOrCreateActiveCart(userId);
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        cartItemRepository.deleteAll(items);
        return toResponse(cart);
    }

    private Cart getOrCreateActiveCart(Long userId) {
        return cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .userId(userId)
                        .status(CartStatus.ACTIVE)
                        .items(new ArrayList<>())
                        .build()));
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

        List<CartItemResponse> itemResponses = items.stream()
                .map(this::toItemResponse)
                .toList();

        int totalItems = itemResponses.stream()
                .mapToInt(CartItemResponse::quantity)
                .sum();

        BigDecimal subtotal = itemResponses.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(
                cart.getId(),
                cart.getUserId(),
                cart.getStatus(),
                itemResponses,
                totalItems,
                subtotal
        );
    }

    private CartItemResponse toItemResponse(CartItem item) {
        ProductVariant variant = item.getProductVariant();
        var product = variant.getProduct();

        String image = product.getImages() == null || product.getImages().isEmpty()
                ? null
                : product.getImages().stream()
                .sorted(Comparator.comparing(ProductImage::getIsPrimary).reversed())
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);

        BigDecimal unitPrice = item.getUnitPriceSnapshot();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return new CartItemResponse(
                item.getId(),
                product.getId(),
                variant.getId(),
                product.getName(),
                image,
                variant.getColorName(),
                variant.getSize(),
                unitPrice,
                item.getQuantity(),
                lineTotal
        );
    }

    private BigDecimal resolvePrice(ProductVariant variant) {
        return variant.getPriceOverride() != null
                ? variant.getPriceOverride()
                : variant.getProduct().getBasePrice();
    }
}
