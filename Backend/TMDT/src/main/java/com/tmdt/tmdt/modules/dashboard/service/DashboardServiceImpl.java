package com.tmdt.tmdt.modules.dashboard.service;

import com.tmdt.tmdt.modules.cart.entity.Cart;
import com.tmdt.tmdt.modules.cart.entity.CartItem;
import com.tmdt.tmdt.modules.cart.repository.CartItemRepository;
import com.tmdt.tmdt.modules.cart.repository.CartRepository;
import com.tmdt.tmdt.modules.catalog.entity.Product;
import com.tmdt.tmdt.modules.catalog.repository.ProductRepository;
import com.tmdt.tmdt.modules.dashboard.dto.DashboardResponse;
import com.tmdt.tmdt.modules.user.entity.User;
import com.tmdt.tmdt.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private static final Locale VI_LOCALE = Locale.forLanguageTag("vi-VN");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public DashboardResponse getDashboardData() {
        List<Cart> allCarts = cartRepository.findAll();
        Map<Long, BigDecimal> cartTotals = computeCartTotals(allCarts);

        List<DashboardResponse.StatCard> stats = buildStats(allCarts, cartTotals);
        List<DashboardResponse.SalesPoint> salesData = buildSalesData(allCarts, cartTotals);
        List<DashboardResponse.CategoryPoint> categoryData = buildCategoryData();
        List<DashboardResponse.RecentOrder> recentOrders = buildRecentOrders(cartTotals);

        return new DashboardResponse(stats, salesData, categoryData, recentOrders);
    }

    private List<DashboardResponse.StatCard> buildStats(List<Cart> allCarts, Map<Long, BigDecimal> cartTotals) {
        BigDecimal totalRevenue = cartTotals.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        long totalOrders = allCarts.size();
        long totalCustomers = userRepository.count();
        long totalProducts = productRepository.count();

        YearMonth currentMonth = YearMonth.now();
        YearMonth previousMonth = currentMonth.minusMonths(1);

        LocalDateTime currentStart = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime currentEnd = currentMonth.atEndOfMonth().atTime(LocalTime.MAX);
        LocalDateTime previousStart = previousMonth.atDay(1).atStartOfDay();
        LocalDateTime previousEnd = previousMonth.atEndOfMonth().atTime(LocalTime.MAX);

        BigDecimal currentRevenue = sumCartTotals(cartRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(currentStart, currentEnd), cartTotals);
        BigDecimal previousRevenue = sumCartTotals(cartRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(previousStart, previousEnd), cartTotals);

        long currentOrders = cartRepository.countByCreatedAtBetween(currentStart, currentEnd);
        long previousOrders = cartRepository.countByCreatedAtBetween(previousStart, previousEnd);

        long currentCustomers = userRepository.countByCreatedAtBetween(currentStart, currentEnd);
        long previousCustomers = userRepository.countByCreatedAtBetween(previousStart, previousEnd);

        long currentProducts = productRepository.countByCreatedAtBetween(currentStart, currentEnd);
        long previousProducts = productRepository.countByCreatedAtBetween(previousStart, previousEnd);

        return List.of(
                new DashboardResponse.StatCard("Tổng Doanh Thu", formatCurrency(totalRevenue), formatTrend(currentRevenue, previousRevenue), currentRevenue.compareTo(previousRevenue) >= 0),
                new DashboardResponse.StatCard("Đơn Hàng Mới", String.valueOf(totalOrders), formatTrend(currentOrders, previousOrders), currentOrders >= previousOrders),
                new DashboardResponse.StatCard("Khách Hàng", String.valueOf(totalCustomers), formatTrend(currentCustomers, previousCustomers), currentCustomers >= previousCustomers),
                new DashboardResponse.StatCard("Sản Phẩm", String.valueOf(totalProducts), formatTrend(currentProducts, previousProducts), currentProducts >= previousProducts)
        );
    }

    private List<DashboardResponse.SalesPoint> buildSalesData(List<Cart> allCarts, Map<Long, BigDecimal> cartTotals) {
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(6);

        Map<LocalDate, long[]> daily = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = start.plusDays(i);
            daily.put(date, new long[]{0L, 0L});
        }

        for (Cart cart : allCarts) {
            LocalDate date = cart.getCreatedAt().toLocalDate();
            if (!daily.containsKey(date)) {
                continue;
            }
            long[] values = daily.get(date);
            values[0] += cartTotals.getOrDefault(cart.getId(), BigDecimal.ZERO).longValue();
            values[1] += 1;
        }

        return daily.entrySet().stream()
                .map(entry -> new DashboardResponse.SalesPoint(dayLabel(entry.getKey()), entry.getValue()[0], entry.getValue()[1]))
                .toList();
    }

    private List<DashboardResponse.CategoryPoint> buildCategoryData() {
        List<Product> products = productRepository.findAll();
        Map<String, Long> grouped = products.stream()
                .filter(product -> product.getCategory() != null)
                .collect(Collectors.groupingBy(product -> product.getCategory().getName(), Collectors.counting()));

        if (grouped.isEmpty()) {
            return List.of(
                    new DashboardResponse.CategoryPoint("Nam", 0),
                    new DashboardResponse.CategoryPoint("Nữ", 0),
                    new DashboardResponse.CategoryPoint("Trẻ em", 0)
            );
        }

        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new DashboardResponse.CategoryPoint(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<DashboardResponse.RecentOrder> buildRecentOrders(Map<Long, BigDecimal> cartTotals) {
        List<Cart> recent = cartRepository.findTop5ByOrderByCreatedAtDesc();
        Set<Long> userIds = recent.stream().map(Cart::getUserId).collect(Collectors.toSet());
        Map<Long, User> users = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        return recent.stream()
                .map(cart -> {
                    User user = users.get(cart.getUserId());
                    String customerName = user == null ? "Khách lẻ" : user.getFirstName() + " " + user.getLastName();
                    return new DashboardResponse.RecentOrder(
                            "#CART-" + cart.getId(),
                            customerName,
                            cart.getCreatedAt().format(DATE_FORMATTER),
                            formatCurrency(cartTotals.getOrDefault(cart.getId(), BigDecimal.ZERO)),
                            mapStatus(cart.getStatus().name())
                    );
                })
                .toList();
    }

    private Map<Long, BigDecimal> computeCartTotals(List<Cart> carts) {
        if (carts.isEmpty()) {
            return Map.of();
        }

        List<Long> cartIds = carts.stream().map(Cart::getId).toList();
        List<CartItem> items = cartItemRepository.findByCartIdIn(cartIds);

        Map<Long, BigDecimal> totals = new LinkedHashMap<>();
        for (CartItem item : items) {
            BigDecimal lineTotal = item.getUnitPriceSnapshot().multiply(BigDecimal.valueOf(item.getQuantity()));
            totals.merge(item.getCart().getId(), lineTotal, BigDecimal::add);
        }
        return totals;
    }

    private BigDecimal sumCartTotals(List<Cart> carts, Map<Long, BigDecimal> cartTotals) {
        return carts.stream()
                .map(cart -> cartTotals.getOrDefault(cart.getId(), BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String dayLabel(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        return switch (day) {
            case MONDAY -> "T2";
            case TUESDAY -> "T3";
            case WEDNESDAY -> "T4";
            case THURSDAY -> "T5";
            case FRIDAY -> "T6";
            case SATURDAY -> "T7";
            case SUNDAY -> "CN";
        };
    }

    private String mapStatus(String status) {
        return switch (status) {
            case "CHECKED_OUT" -> "Completed";
            case "ABANDONED" -> "Cancelled";
            default -> "Pending";
        };
    }

    private String formatCurrency(BigDecimal amount) {
        NumberFormat formatter = NumberFormat.getNumberInstance(VI_LOCALE);
        formatter.setMaximumFractionDigits(0);
        return formatter.format(amount) + "đ";
    }

    private String formatTrend(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? "+100%" : "0%";
        }
        BigDecimal change = current.subtract(previous)
                .multiply(BigDecimal.valueOf(100))
                .divide(previous, 0, java.math.RoundingMode.HALF_UP);
        return (change.signum() >= 0 ? "+" : "") + change + "%";
    }

    private String formatTrend(long current, long previous) {
        if (previous == 0) {
            return current > 0 ? "+100%" : "0%";
        }
        long value = Math.round((current - previous) * 100.0 / previous);
        return (value >= 0 ? "+" : "") + value + "%";
    }
}
