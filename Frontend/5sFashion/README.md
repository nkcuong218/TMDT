# 5S Fashion Frontend

Dự án Website Thương mại điện tử thời trang (5S Fashion) - Frontend.

## 🚀 Giới Thiệu
5S Fashion là nền tảng mua sắm thời trang trực tuyến dành cho nam, nữ và trẻ em. Hệ thống bao gồm giao diện dành cho khách hàng mua sắm và giao diện quản trị (Admin Dashboard) để quản lý vận hành.

## 🛠️ Công Nghệ Sử Dụng
*   **Framework**: [React](https://react.dev/) (v19)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
*   **Biểu Đồ**: [Recharts](https://recharts.org/) (cho Dashboard)
*   **Styling**: CSS Thuần (Custom Properties & Responsive Flexbox/Grid)

## ✨ Tính Năng Chính

### 🛒 Client (Khách Hàng)
1.  **Trang Chủ**: Banner slide, hiển thị bộ sưu tập mới, sản phẩm bán chạy.
2.  **Sản Phẩm**:
    *   Xem danh sách sản phẩm theo danh mục (Nam/Nữ/Bé trai/Bé gái).
    *   Xem chi tiết sản phẩm: chọn màu, size, xem ảnh phóng to.
3.  **Giỏ Hàng & Thanh Toán**:
    *   Thêm/Sửa/Xóa sản phẩm trong giỏ.
    *   **Checkout nâng cao**:
        *   Chọn địa chỉ giao hàng.
        *   **Hệ thống Voucher**: Chọn đồng thời Voucher Vận Chuyển và Voucher Đơn Hàng.
        *   Tính toán tổng tiền tự động.
4.  **Mega Menu**: Menu điều hướng đa cấp trực quan.

### 🛡️ Admin (Quản Trị Viên)
Truy cập tại: `/admin` (Tự động cấp quyền trong môi trường Dev).

1.  **Dashboard**:
    *   Thống kê tổng quan (Doanh thu, Đơn hàng, Khách hàng).
    *   Biểu đồ Doanh thu (Area Chart), Tăng trưởng khách hàng (Bar Chart), Cơ cấu đơn hàng (Pie Chart).
2.  **Quản Lý Đơn Hàng**:
    *   Xem danh sách đơn hàng, lọc theo trạng thái.
    *   **Chi tiết đơn hàng**: Xem thông tin khách, sản phẩm, cập nhật trạng thái đơn (Pending -> Shipping -> Completed...).
    *   In hóa đơn (Mock UI).
3.  **Quản Lý Khách Hàng**:
    *   Danh sách người dùng, tìm kiếm.
    *   **Chi tiết khách hàng**: Xem lịch sử mua hàng, tổng chi tiêu.
    *   **Khóa/Mở khóa** tài khoản người dùng an toàn.
4.  **Quản Lý Sản Phẩm**: Danh sách sản phẩm, tồn kho (CRUD cơ bản).

## 📂 Cấu Trúc Thư Mục

```
src/
├── assets/             # Tài nguyên ảnh, icons
├── components/         # Components tái sử dụng
│   ├── AdminLayout/    # Layout riêng cho Admin (Sidebar trắng, Logo)
│   ├── Header/         # Header chính (Mega Menu)
│   ├── Footer/         # Footer
│   └── Layout/         # Layout mặc định cho Client
├── pages/              # Các trang giao diện (Pages)
│   ├── Admin/          # Phân hệ Admin
│   │   ├── Dashboard/  # Trang thống kê
│   │   ├── Orders/     # Quản lý đơn hàng (Manager + Detail)
│   │   ├── Customers/  # Quản lý khách hàng (Manager + Detail)
│   │   └── Products/   # Quản lý sản phẩm
│   ├── Checkout/       # Trang thanh toán
│   ├── Home/           # Trang chủ
│   ├── Cart/           # Giỏ hàng
│   ├── ProductDetail/  # Chi tiết sản phẩm
│   └── ...
├── App.jsx             # Cấu hình Routing & Mock Auth
└── main.jsx            # Entry point
```

## 🚀 Cài Đặt & Chạy Dự Án

1.  **Clone dự án**:
    ```bash
    git clone <repository_url>
    cd 5sFashion
    ```

2.  **Cài đặt thư viện**:
    ```bash
    npm install
    ```

3.  **Chạy server phát triển**:
    ```bash
    npm run dev
    ```
    Truy cập: `http://localhost:5173`

## 🔐 Mock Admin Access
Mặc định trong môi trường Development (`App.jsx`), hệ thống sẽ tự động gán quyền Admin (`localStorage.setItem('user_role', 'admin')`) để thuận tiện cho việc kiểm thử các chức năng quản trị.

---
**PTHTTMDT** - Web5sFashion Project
