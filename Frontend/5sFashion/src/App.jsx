import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login'; // Kept Login import as it's used in a route
import Register from './pages/Register/Register';
// import Account from './pages/Account/Account'; // Temporarily disabled
import ProductList from './pages/ProductList/ProductList';
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

function App() {
  // DEV: Force Admin Role for testing
  React.useEffect(() => {
    localStorage.setItem('user_role', 'admin');
    localStorage.setItem('isLoggedIn', 'true');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes here */}
        {/* <Route path="/account" element={<Account />} /> */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

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
