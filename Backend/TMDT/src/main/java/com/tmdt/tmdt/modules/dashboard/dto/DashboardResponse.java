package com.tmdt.tmdt.modules.dashboard.dto;

import java.util.List;

public record DashboardResponse(
        List<StatCard> stats,
        List<SalesPoint> salesData,
        List<CategoryPoint> categoryData,
        List<RecentOrder> recentOrders
) {
    public record StatCard(String label, String value, String trend, boolean isUp) {
    }

    public record SalesPoint(String name, long revenue, long orders) {
    }

    public record CategoryPoint(String name, long value) {
    }

    public record RecentOrder(String id, String customer, String date, String total, String status) {
    }
}
