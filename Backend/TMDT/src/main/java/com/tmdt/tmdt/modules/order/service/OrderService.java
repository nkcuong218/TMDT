package com.tmdt.tmdt.modules.order.service;

import com.tmdt.tmdt.modules.cart.entity.Cart;
import com.tmdt.tmdt.modules.cart.entity.CartItem;
import com.tmdt.tmdt.modules.cart.entity.CartStatus;
import com.tmdt.tmdt.modules.cart.repository.CartItemRepository;
import com.tmdt.tmdt.modules.cart.repository.CartRepository;
import com.tmdt.tmdt.modules.order.dto.request.CreateOrderRequest;
import com.tmdt.tmdt.modules.order.dto.request.UpdateOrderStatusRequest;
import com.tmdt.tmdt.modules.order.dto.response.*;
import com.tmdt.tmdt.modules.order.entity.Order;
import com.tmdt.tmdt.modules.order.entity.OrderItem;
import com.tmdt.tmdt.modules.order.entity.OrderStatus;
import com.tmdt.tmdt.modules.order.entity.PaymentMethod;
import com.tmdt.tmdt.modules.order.repository.OrderItemRepository;
import com.tmdt.tmdt.modules.order.repository.OrderRepository;
import com.tmdt.tmdt.modules.user.entity.User;
import com.tmdt.tmdt.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final UserRepository userRepository;

	@Transactional
	public CreateOrderResponse createOrder(CreateOrderRequest request) {
		Cart cart = cartRepository.findByUserIdAndStatus(request.userId(), CartStatus.ACTIVE)
				.orElseThrow(() -> new RuntimeException("Gio hang hien tai khong ton tai"));

		List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
		if (cartItems.isEmpty()) {
			throw new RuntimeException("Gio hang trong, khong the tao don");
		}

		User user = userRepository.findById(request.userId())
				.orElseThrow(() -> new RuntimeException("Khong tim thay nguoi dung voi id: " + request.userId()));

		BigDecimal subtotal = cartItems.stream()
				.map(item -> item.getUnitPriceSnapshot().multiply(BigDecimal.valueOf(item.getQuantity())))
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		BigDecimal shippingFee = request.shippingFee() == null ? BigDecimal.ZERO : request.shippingFee();
		BigDecimal discountAmount = request.discountAmount() == null ? BigDecimal.ZERO : request.discountAmount();
		BigDecimal totalAmount = subtotal.add(shippingFee).subtract(discountAmount);
		if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
			totalAmount = BigDecimal.ZERO;
		}

		Order order = Order.builder()
				.orderCode("TEMP")
				.userId(user.getId())
				.customerName(request.fullName())
				.phone(request.phone())
				.email(request.email())
				.address(request.address())
				.note(request.note())
				.paymentMethod(parsePaymentMethod(request.paymentMethod()))
				.subtotal(subtotal)
				.shippingFee(shippingFee)
				.discountAmount(discountAmount)
				.totalAmount(totalAmount)
				.status(OrderStatus.PENDING)
				.items(new ArrayList<>())
				.build();

		Order persistedOrder = orderRepository.save(order);
		persistedOrder.setOrderCode(buildOrderCode(persistedOrder.getId()));
		persistedOrder = orderRepository.save(persistedOrder);
		Order orderForItems = persistedOrder;

		List<OrderItem> orderItems = cartItems.stream()
				.map(item -> toOrderItem(orderForItems, item))
				.toList();
		orderItemRepository.saveAll(orderItems);

		cart.setStatus(CartStatus.CHECKED_OUT);
		cartRepository.save(cart);

		return new CreateOrderResponse(
				persistedOrder.getId(),
				persistedOrder.getOrderCode(),
				persistedOrder.getTotalAmount().longValue(),
				toStatusLabel(persistedOrder.getStatus()),
				"Dat hang thanh cong"
		);
	}

	public List<AdminOrderListItemResponse> getAdminOrders(String status) {
		List<Order> orders = parseOptionalStatus(status)
				.map(orderRepository::findByStatusOrderByCreatedAtDesc)
				.orElseGet(orderRepository::findAllByOrderByCreatedAtDesc);

		return orders.stream()
				.map(this::toAdminListItem)
				.toList();
	}

	public List<UserOrderListItemResponse> getMyOrders(Long userId) {
		if (userId == null) {
			throw new RuntimeException("Thieu userId de lay lich su don hang");
		}

		List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
		return orders.stream()
				.map(order -> new UserOrderListItemResponse(
						order.getId(),
						order.getOrderCode(),
						formatDate(order.getCreatedAt()),
						order.getTotalAmount().longValue(),
						toStatusLabel(order.getStatus())
				))
				.toList();
	}

	public OrderDetailResponse getAdminOrderDetail(Long orderId) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Khong tim thay don hang voi id: " + orderId));

		List<OrderItemResponse> items = orderItemRepository.findByOrderId(order.getId()).stream()
				.map(item -> new OrderItemResponse(
						item.getId(),
						item.getProductName(),
						item.getSku(),
						item.getSize(),
						item.getColor(),
						item.getQuantity(),
						item.getUnitPrice()
				))
				.toList();

		List<OrderHistoryResponse> history = buildHistory(order);

		return new OrderDetailResponse(
				order.getId(),
				order.getOrderCode(),
				order.getCustomerName(),
				order.getPhone(),
				order.getEmail(),
				formatDate(order.getCreatedAt()),
				order.getTotalAmount().longValue(),
				toStatusLabel(order.getStatus()),
				order.getPaymentMethod().name(),
				order.getShippingFee().longValue(),
				order.getAddress(),
				items,
				history
		);
	}

	@Transactional
	public OrderDetailResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Khong tim thay don hang voi id: " + orderId));

		order.setStatus(parseOrderStatus(request.status()));
		orderRepository.save(order);
		return getAdminOrderDetail(orderId);
	}

	private AdminOrderListItemResponse toAdminListItem(Order order) {
		return new AdminOrderListItemResponse(
				order.getId(),
				order.getOrderCode(),
				order.getCustomerName(),
				order.getPhone(),
				formatDate(order.getCreatedAt()),
				order.getTotalAmount().longValue(),
				toStatusLabel(order.getStatus())
		);
	}

	private OrderItem toOrderItem(Order order, CartItem cartItem) {
		var variant = cartItem.getProductVariant();
		var product = variant.getProduct();
		BigDecimal lineTotal = cartItem.getUnitPriceSnapshot().multiply(BigDecimal.valueOf(cartItem.getQuantity()));

		return OrderItem.builder()
				.order(order)
				.productVariantId(variant.getId())
				.productName(product.getName())
				.sku(variant.getSku())
				.size(variant.getSize())
				.color(variant.getColorName())
				.unitPrice(cartItem.getUnitPriceSnapshot())
				.quantity(cartItem.getQuantity())
				.lineTotal(lineTotal)
				.build();
	}

	private List<OrderHistoryResponse> buildHistory(Order order) {
		List<OrderHistoryResponse> history = new ArrayList<>();
		history.add(new OrderHistoryResponse(formatDate(order.getCreatedAt()), "Don hang duoc tao"));

		if (order.getStatus() != OrderStatus.PENDING) {
			LocalDateTime updatedAt = order.getUpdatedAt() == null ? order.getCreatedAt() : order.getUpdatedAt();
			history.add(new OrderHistoryResponse(
					formatDate(updatedAt),
					"Cap nhat trang thai: " + toStatusLabel(order.getStatus())
			));
		}

		return history;
	}

	private String buildOrderCode(Long id) {
		return String.format(Locale.ROOT, "ORD-%06d", id);
	}

	private java.util.Optional<OrderStatus> parseOptionalStatus(String status) {
		if (status == null || status.isBlank() || "All".equalsIgnoreCase(status)) {
			return java.util.Optional.empty();
		}
		return java.util.Optional.of(parseOrderStatus(status));
	}

	private OrderStatus parseOrderStatus(String status) {
		return switch (status.trim().toUpperCase(Locale.ROOT)) {
			case "PENDING" -> OrderStatus.PENDING;
			case "PROCESSING" -> OrderStatus.PROCESSING;
			case "SHIPPING" -> OrderStatus.SHIPPING;
			case "COMPLETED" -> OrderStatus.COMPLETED;
			case "CANCELLED" -> OrderStatus.CANCELLED;
			default -> throw new RuntimeException("Trang thai don hang khong hop le: " + status);
		};
	}

	private PaymentMethod parsePaymentMethod(String paymentMethod) {
		return switch (paymentMethod.trim().toUpperCase(Locale.ROOT)) {
			case "COD" -> PaymentMethod.COD;
			case "BANKING" -> PaymentMethod.BANKING;
			case "MOMO" -> PaymentMethod.MOMO;
			default -> throw new RuntimeException("Phuong thuc thanh toan khong hop le: " + paymentMethod);
		};
	}

	private String toStatusLabel(OrderStatus status) {
		return switch (status) {
			case PENDING -> "Pending";
			case PROCESSING -> "Processing";
			case SHIPPING -> "Shipping";
			case COMPLETED -> "Completed";
			case CANCELLED -> "Cancelled";
		};
	}

	private String formatDate(LocalDateTime dateTime) {
		if (dateTime == null) {
			return "-";
		}
		return dateTime.format(DATE_FORMATTER);
	}

}
