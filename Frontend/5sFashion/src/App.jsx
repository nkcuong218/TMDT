import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Account from './pages/Account/Account';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import AdminDashboard from './pages/Admin/Dashboard/Dashboard';
import ProductManager from './pages/Admin/Products/ProductManager';
import AddProduct from './pages/Admin/Products/AddProduct';
import OrderManager from './pages/Admin/Orders/OrderManager';
import OrderDetail from './pages/Admin/Orders/OrderDetail';
import CustomerManager from './pages/Admin/Customers/CustomerManager';
import CustomerDetail from './pages/Admin/Customers/CustomerDetail';
import WarehouseManager from './pages/Admin/Warehouse/WarehouseManager';
import WarehouseHistory from './pages/Admin/Warehouse/WarehouseHistory';
import WarehouseInvoice from './pages/Admin/Warehouse/WarehouseInvoice';
import WarehouseImport from './pages/Admin/Warehouse/WarehouseImport';
import Settings from './pages/Settings/Settings';

const __inlineStyles_app = `
/* App specific styles if needed */
`;

if (typeof document !== 'undefined' && !document.getElementById('app-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'app-styles';
  styleEl.textContent = __inlineStyles_app;
  document.head.appendChild(styleEl);
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/products" element={<Navigate to="/" replace />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductManager />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/orders" element={<OrderManager />} />
        <Route path="/admin/orders/:id" element={<OrderDetail />} />
        <Route path="/admin/users" element={<CustomerManager />} />
        <Route path="/admin/users/:id" element={<CustomerDetail />} />
        <Route path="/admin/warehouse" element={<WarehouseManager />} />
        <Route path="/admin/warehouse/history/:id" element={<WarehouseHistory />} />
        <Route path="/admin/warehouse/invoice/:id" element={<WarehouseInvoice />} />
        <Route path="/admin/warehouse/import" element={<WarehouseImport />} />
      </Routes>
    </Router>
  );
}

export default App;
