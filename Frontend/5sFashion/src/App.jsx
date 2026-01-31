import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login'; // Kept Login import as it's used in a route
import Register from './pages/Register/Register';
// import Account from './pages/Account/Account'; // Temporarily disabled
import ProductList from './pages/ProductList/ProductList';
import CategoryPage from './pages/CategoryPage/CategoryPage';

function App() {
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
      </Routes>
    </Router>
  );
}

export default App;
