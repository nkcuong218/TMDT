package com.tmdt.tmdt.modules.user.service;

import com.tmdt.tmdt.modules.order.entity.Order;
import com.tmdt.tmdt.modules.order.entity.OrderStatus;
import com.tmdt.tmdt.modules.order.repository.OrderRepository;
import com.tmdt.tmdt.modules.user.dto.response.CustomerDetailResponse;
import com.tmdt.tmdt.modules.user.dto.response.CustomerListItemResponse;
import com.tmdt.tmdt.modules.user.entity.AccountStatus;
import com.tmdt.tmdt.modules.user.entity.User;
import com.tmdt.tmdt.modules.user.entity.UserRole;
import com.tmdt.tmdt.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

	private final UserRepository userRepository;
	private final OrderRepository orderRepository;

	public List<CustomerListItemResponse> getCustomers(String keyword) {
		List<User> customers = userRepository.findByRoleOrderByCreatedAtDesc(UserRole.CUSTOMER).stream()
				.filter(user -> filterByKeyword(user, keyword))
				.toList();

		return customers.stream()
				.map(this::toCustomerListItem)
				.toList();
	}

	public CustomerDetailResponse getCustomerDetail(Long customerId) {
		User customer = userRepository.findById(customerId)
				.filter(user -> user.getRole() == UserRole.CUSTOMER)
				.orElseThrow(() -> new RuntimeException("Khong tim thay khach hang voi id: " + customerId));

		List<Order> ordersData = orderRepository.findByUserIdOrderByCreatedAtDesc(customer.getId());
		long totalSpent = sumOrderTotals(ordersData);
		String lastOrderDate = ordersData.isEmpty() ? "-" : formatDate(ordersData.get(0).getCreatedAt());

		List<CustomerDetailResponse.OrderItem> orders = ordersData.stream()
				.map(this::toOrderItem)
				.toList();

		return new CustomerDetailResponse(
				customer.getId(),
				(customer.getLastName() + " " + customer.getFirstName()).trim(),
				customer.getEmail(),
				customer.getPhone(),
				"Chua cap nhat",
				formatDate(customer.getCreatedAt()),
				toStatusLabel(customer.getStatus()),
				new CustomerDetailResponse.Stats(ordersData.size(), totalSpent, lastOrderDate),
				orders
		);
	}

	@Transactional
	public CustomerListItemResponse toggleCustomerStatus(Long customerId) {
		User customer = userRepository.findById(customerId)
				.filter(user -> user.getRole() == UserRole.CUSTOMER)
				.orElseThrow(() -> new RuntimeException("Khong tim thay khach hang voi id: " + customerId));

		customer.setStatus(customer.getStatus() == AccountStatus.BLOCKED ? AccountStatus.ACTIVE : AccountStatus.BLOCKED);
		customer = userRepository.save(customer);
		return toCustomerListItem(customer);
	}

	private CustomerListItemResponse toCustomerListItem(User user) {
		List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
		long totalSpent = sumOrderTotals(orders);
		return new CustomerListItemResponse(
				user.getId(),
				(user.getLastName() + " " + user.getFirstName()).trim(),
				user.getEmail(),
				user.getPhone(),
				orders.size(),
				totalSpent,
				toStatusLabel(user.getStatus())
		);
	}

	private CustomerDetailResponse.OrderItem toOrderItem(Order order) {
		long total = order.getTotalAmount().longValue();
		String code = "#" + order.getOrderCode();
		return new CustomerDetailResponse.OrderItem(
				order.getId(),
				code,
				formatDate(order.getCreatedAt()),
				total,
				toOrderStatus(order.getStatus())
		);
	}

	private long sumOrderTotals(List<Order> orders) {
		return orders.stream()
				.mapToLong(order -> order.getTotalAmount().longValue())
				.sum();
	}

	private String toOrderStatus(OrderStatus status) {
		return switch (status) {
			case PENDING -> "Pending";
			case PROCESSING -> "Processing";
			case SHIPPING -> "Shipping";
			case COMPLETED -> "Completed";
			case CANCELLED -> "Cancelled";
		};
	}

	private String toStatusLabel(AccountStatus status) {
		return status == AccountStatus.BLOCKED ? "Blocked" : "Active";
	}

	private String formatDate(LocalDateTime dateTime) {
		if (dateTime == null) {
			return "-";
		}
		return dateTime.format(DATE_FORMATTER);
	}

	private boolean filterByKeyword(User user, String keyword) {
		if (keyword == null || keyword.isBlank()) {
			return true;
		}

		String lower = keyword.trim().toLowerCase(Locale.ROOT);
		String fullName = (user.getLastName() + " " + user.getFirstName()).toLowerCase(Locale.ROOT);

		return fullName.contains(lower)
				|| user.getEmail().toLowerCase(Locale.ROOT).contains(lower)
				|| user.getPhone().toLowerCase(Locale.ROOT).contains(lower);
	}
}
