import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { getCart, removeCartItem, toCartItemViewModel, updateCartItem } from '../../services/catalogApi';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const userId = Number(localStorage.getItem('user_id') || 1);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadCart = async () => {
        try {
            setLoading(true);
            setError('');
            const cart = await getCart(userId);
            setCartItems((cart?.items || []).map(toCartItemViewModel));
        } catch (err) {
            setError(err.message || 'Khong the tai gio hang');
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (id, delta) => {
        const item = cartItems.find((entry) => entry.id === id);
        if (!item) {
            return;
        }

        const newQty = Math.max(1, item.quantity + delta);
        try {
            await updateCartItem(userId, id, newQty);
            await loadCart();
        } catch (err) {
            setError(err.message || 'Cap nhat so luong that bai');
        }
    };

    const handleRemove = async (id) => {
        try {
            await removeCartItem(userId, id);
            await loadCart();
        } catch (err) {
            setError(err.message || 'Xoa san pham that bai');
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500000 ? 0 : 30000;
    const total = subtotal + shipping;

    useEffect(() => {
        window.scrollTo(0, 0);
        loadCart();
    }, []);

    return (
        <Layout>
            <div className="cart-page">
                <div className="container">
                    <h1 className="cart-title">Giỏ Hàng Của Bạn ({cartItems.length} sản phẩm)</h1>

                    {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
                    {loading && <p>Dang tai gio hang...</p>}

                    {!loading && cartItems.length > 0 ? (
                        <div className="cart-layout">
                            {/* Items List */}
                            <div className="cart-items-section">
                                <div className="cart-header-row">
                                    <div className="col-product">Sản Phẩm</div>
                                    <div className="col-price">Đơn Giá</div>
                                    <div className="col-qty">Số Lượng</div>
                                    <div className="col-total">Thành Tiền</div>
                                    <div className="col-action"></div>
                                </div>

                                {cartItems.map(item => (
                                    <div className="cart-item" key={item.id}>
                                        <div className="col-product ci-info">
                                            <div className="ci-image">
                                                <Link to={`/product/${item.product_id}`}>
                                                    <img src={item.image} alt={item.title} />
                                                </Link>
                                            </div>
                                            <div className="ci-details">
                                                <Link to={`/product/${item.product_id}`} style={{ textDecoration: 'none' }}>
                                                    <h3>{item.title}</h3>
                                                </Link>
                                                <div className="ci-variant">Màu: {item.color} / Size: {item.size}</div>
                                            </div>
                                        </div>
                                        <div className="col-price ci-price">
                                            {item.price.toLocaleString()}đ
                                        </div>
                                        <div className="col-qty ci-qty">
                                            <button className="qty-btn" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                            <input type="text" className="qty-input" value={item.quantity} readOnly />
                                            <button className="qty-btn" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                        </div>
                                        <div className="col-total ci-total">
                                            {(item.price * item.quantity).toLocaleString()}đ
                                        </div>
                                        <div className="col-action">
                                            <button className="ci-remove" onClick={() => handleRemove(item.id)} title="Xóa">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Box */}
                            <div className="cart-summary-section">
                                <div className="summary-title">Thông Tin Đơn Hàng</div>
                                <div className="summary-row">
                                    <span>Tạm tính:</span>
                                    <span>{subtotal.toLocaleString()}đ</span>
                                </div>
                                <div className="summary-row">
                                    <span>Phí vận chuyển:</span>
                                    <span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString()}đ`}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Tổng cộng:</span>
                                    <span>{total.toLocaleString()}đ</span>
                                </div>
                                <button className="checkout-btn" onClick={() => navigate('/checkout')}>Thanh Toán</button>
                                <Link to="/products" className="continue-shopping">Tiếp tục mua sắm</Link>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <p>Giỏ hàng của bạn đang trống.</p>
                            <Link to="/products" style={{ textDecoration: 'underline', color: 'blue' }}>Mua sắm ngay</Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
