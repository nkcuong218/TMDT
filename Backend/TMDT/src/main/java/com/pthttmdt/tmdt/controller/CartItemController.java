package com.pthttmdt.tmdt.controller;

import com.pthttmdt.tmdt.dto.CartItemDto;
import com.pthttmdt.tmdt.entity.CartItem;
import com.pthttmdt.tmdt.entity.User;
import com.pthttmdt.tmdt.mapper.CartItemMapper;
import com.pthttmdt.tmdt.security.CurrentUserService;
import com.pthttmdt.tmdt.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
@RequiredArgsConstructor
public class CartItemController {
    private final CartItemService cartItemService;
    private final CartItemMapper cartItemMapper;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<CartItemDto> getAll() {
        return cartItemService.getAll().stream().map(cartItemMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public CartItemDto getById(@PathVariable Long id, Authentication authentication) {
        try {
            CartItem cartItem = cartItemService.getById(id);
            Long ownerId = cartItem.getUser() != null ? cartItem.getUser().getId() : null;
            validateUserAccess(ownerId, authentication);
            return cartItemMapper.toDto(cartItem);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/me")
    public List<CartItemDto> getMyCart(Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        return cartItemService.getByUserId(currentUser.getId()).stream().map(cartItemMapper::toDto).toList();
    }

    @GetMapping("/user/{userId}")
    public List<CartItemDto> getByUserId(@PathVariable Long userId, Authentication authentication) {
        validateUserAccess(userId, authentication);
        return cartItemService.getByUserId(userId).stream().map(cartItemMapper::toDto).toList();
    }

    @GetMapping("/user/{userId}/variant/{productVariantId}")
    public ResponseEntity<CartItemDto> getByUserIdAndVariantId(
            @PathVariable Long userId,
            @PathVariable Long productVariantId,
            Authentication authentication
    ) {
        validateUserAccess(userId, authentication);
        return cartItemService.getByUserIdAndVariantId(userId, productVariantId)
                .map(cartItemMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CartItemDto> create(@RequestBody CartItemDto dto, Authentication authentication) {
        validateUserAccess(dto.getUserId(), authentication);
        CartItem saved = cartItemService.save(cartItemMapper.toEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(cartItemMapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public CartItemDto update(@PathVariable Long id, @RequestBody CartItemDto dto, Authentication authentication) {
        if (dto.getUserId() == null) {
            CartItem existing = cartItemService.getById(id);
            dto.setUserId(existing.getUser() != null ? existing.getUser().getId() : null);
        }
        validateUserAccess(dto.getUserId(), authentication);
        dto.setId(id);
        CartItem saved = cartItemService.save(cartItemMapper.toEntity(dto));
        return cartItemMapper.toDto(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        CartItem existing = cartItemService.getById(id);
        Long ownerId = existing.getUser() != null ? existing.getUser().getId() : null;
        validateUserAccess(ownerId, authentication);
        cartItemService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> clearByUser(@PathVariable Long userId, Authentication authentication) {
        validateUserAccess(userId, authentication);
        cartItemService.clearByUserId(userId);
        return ResponseEntity.noContent().build();
    }

    private void validateUserAccess(Long userId, Authentication authentication) {
        User currentUser = currentUserService.requireCurrentUser(authentication);
        if (!currentUserService.isAdmin(currentUser) && !currentUser.getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }
}
