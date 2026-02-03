import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './Checkout.css';

// Import images
import p1 from '../../assets/product1.jpg';
import p2 from '../../assets/product2.jpg';

const Checkout = () => {
    const navigate = useNavigate();

    // Mock Data from Cart
    const cartItems = [
        {
            id: 101,
            title: 'Áo Khoác Gió Nam Pro-DWR 5S',
            image: p1,
            color: 'Xanh Rêu',
            size: 'L',
            price: 499000,
            quantity: 1
        },
        {
            id: 102,
            title: 'Quần Short Kaki Nam 5S Fashion',
            image: p2,
            color: 'Be',
            size: '30',
            price: 299000,
            quantity: 2
        }
    ];

    const [savedAddresses, setSavedAddresses] = useState([
        { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', type: 'Nhà Riêng' },
        { id: 2, name: 'Trần Thị B', phone: '0987654321', address: 'Tòa nhà Bitexco, Quận 1, TP.HCM', type: 'Văn Phòng' }
    ]);
    const [selectedAddressId, setSelectedAddressId] = useState(1);
    const [isNewAddress, setIsNewAddress] = useState(false);

    // Voucher Data & State
    const [availableVouchers] = useState([
        { id: 1, code: 'FREESHIP', amount: 30000, desc: 'Giảm tối đa 30k phí vận chuyển', type: 'shipping' },
        { id: 2, code: '5SNEW', amount: 50000, desc: 'Giảm 50k cho đơn hàng từ 0đ', type: 'order' },
        { id: 3, code: 'SALE10K', amount: 10000, desc: 'Giảm 10k cho mọi đơn hàng', type: 'order' }
    ]);

    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [selectedShippingVoucherId, setSelectedShippingVoucherId] = useState(null);
    const [selectedOrderVoucherId, setSelectedOrderVoucherId] = useState(null);

    const [manualVoucherInput, setManualVoucherInput] = useState('');

    // Discount Calculation
    const [shippingDiscount, setShippingDiscount] = useState(0);
    const [orderDiscount, setOrderDiscount] = useState(0);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000;

    // Logic to update discounts
    useEffect(() => {
        // Shipping Disc logic
        if (selectedShippingVoucherId) {
            const v = availableVouchers.find(x => x.id === selectedShippingVoucherId);
            // Cap at actual shipping fee
            setShippingDiscount(v ? Math.min(v.amount, shippingFee) : 0);
        } else {
            setShippingDiscount(0);
        }

        // Order Disc logic
        if (selectedOrderVoucherId) {
            const v = availableVouchers.find(x => x.id === selectedOrderVoucherId);
            setOrderDiscount(v ? v.amount : 0);
        } else {
            setOrderDiscount(0);
        }
    }, [selectedShippingVoucherId, selectedOrderVoucherId, shippingFee, availableVouchers]);

    const total = Math.max(0, subtotal + shippingFee - shippingDiscount - orderDiscount);

    // Helpers
    const handleApplyManual = () => {
        // Mock check manual
        alert(`Tính năng nhập mã thủ công: ${manualVoucherInput} (Chưa implement logic check thực tế)`);
    };

    const toggleShippingVoucher = (id) => {
        if (selectedShippingVoucherId === id) setSelectedShippingVoucherId(null);
        else setSelectedShippingVoucherId(id);
    };

    const toggleOrderVoucher = (id) => {
        if (selectedOrderVoucherId === id) setSelectedOrderVoucherId(null);
        else setSelectedOrderVoucherId(id);
    };

    const [formData, setFormData] = useState({
        fullName: '', phone: '', email: '', address: '', city: '', district: '', ward: '', note: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Final Data Construction
        let finalAddress = isNewAddress ? { ...formData } : savedAddresses.find(a => a.id === selectedAddressId);

        console.log('Order Placed:', {
            address: finalAddress,
            items: cartItems,
            payment: paymentMethod,
            vouchers: {
                shipping: selectedShippingVoucherId,
                order: selectedOrderVoucherId
            },
            total: total
        });

        alert('Đặt hàng thành công!');
        navigate('/');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Derived Label for Voucher Bar
    const getVoucherLabel = () => {
        let count = 0;
        if (selectedShippingVoucherId) count++;
        if (selectedOrderVoucherId) count++;

        if (count === 0) return 'Chọn hoặc nhập mã';
        return `Đã chọn ${count} mã ưu đãi`;
    };

    return (
        <Layout>
            <div className="checkout-page">
                <form className="checkout-container" onSubmit={handleSubmit}>

                    {/* Left Column */}
                    <div className="checkout-info">

                        {/* Address Section */}
                        <div className="checkout-section">
                            <div className="section-title"><span>1</span> ĐỊA CHỈ NHẬN HÀNG</div>
                            <div className="address-list">
                                {savedAddresses.map(addr => (
                                    <label key={addr.id} className={`address-card ${selectedAddressId === addr.id ? 'active' : ''}`}>
                                        <div className="address-radio">
                                            <input type="radio" name="addr_sel" checked={selectedAddressId === addr.id} onChange={() => { setSelectedAddressId(addr.id); setIsNewAddress(false); }} />
                                        </div>
                                        <div className="address-content">
                                            <div className="addr-header">
                                                <span className="addr-name">{addr.name}</span>
                                                <span className="addr-phone">{addr.phone}</span>
                                                {addr.type && <span className="addr-tag">{addr.type}</span>}
                                            </div>
                                            <div className="addr-text">{addr.address}</div>
                                        </div>
                                    </label>
                                ))}
                                <label className={`address-card ${isNewAddress ? 'active' : ''}`}>
                                    <div className="address-radio">
                                        <input type="radio" name="addr_sel" checked={isNewAddress} onChange={() => { setSelectedAddressId(null); setIsNewAddress(true); }} />
                                    </div>
                                    <div className="address-content"><b>Sử dụng địa chỉ khác</b></div>
                                </label>
                            </div>
                            {isNewAddress && (
                                <div className="form-grid" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                    <div className="form-group"><label>Họ tên *</label><input className="form-input" name="fullName" required onChange={handleChange} /></div>
                                    <div className="form-group"><label>SĐT *</label><input className="form-input" name="phone" required onChange={handleChange} /></div>
                                    <div className="form-group full"><label>Địa chỉ *</label><input className="form-input" name="address" required onChange={handleChange} /></div>
                                    <div className="form-group"><label>Tỉnh/Thành</label><select className="form-input" name="city" required onChange={handleChange}><option>Hà Nội</option></select></div>
                                    <div className="form-group"><label>Quận/Huyện</label><select className="form-input" name="district" required onChange={handleChange}><option>Quận 1</option></select></div>
                                </div>
                            )}
                        </div>

                        {/* Voucher Section */}
                        <div className="checkout-section">
                            <div className="section-title"><span>2</span> MÃ ƯU ĐÃI / VOUCHER</div>

                            {/* Part 1: Input */}
                            <div className="voucher-group">
                                <input
                                    className="form-input"
                                    placeholder="Nhập mã voucher"
                                    value={manualVoucherInput}
                                    onChange={(e) => setManualVoucherInput(e.target.value)}
                                />
                                <button type="button" className="voucher-btn" onClick={handleApplyManual}>ÁP DỤNG</button>
                            </div>

                            {/* Part 2: Select Bar */}
                            <div className="voucher-selector-bar" onClick={() => setShowVoucherModal(true)}>
                                <div className="vs-label">
                                    <svg className="vs-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M2 9h20v6h-20v-6zm18-2H4V5h16v2zm-16 10h16v2H4v-2z" opacity=".3"></path><path d="M20 7h-1V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM7 5h10v2H7V5zM4 19V9h16v10H4z"></path></svg>
                                    <span>Chọn Voucher</span>
                                </div>
                                <div className="vs-value">{getVoucherLabel()} &gt;</div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="checkout-section">
                            <div className="section-title"><span>3</span> PHƯƠNG THỨC THANH TOÁN</div>
                            <div className="payment-options">
                                <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                    <input type="radio" name="pay" className="payment-radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                    <div className="payment-label">Thanh toán khi nhận hàng (COD)</div>
                                </label>
                                <label className={`payment-option ${paymentMethod === 'banking' ? 'active' : ''}`}>
                                    <input type="radio" name="pay" className="payment-radio" checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} />
                                    <div className="payment-label">Chuyển khoản ngân hàng</div>
                                </label>
                                <label className={`payment-option ${paymentMethod === 'momo' ? 'active' : ''}`}>
                                    <input type="radio" name="pay" className="payment-radio" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} />
                                    <div className="payment-label">Ví MoMo</div>
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Summary */}
                    <div className="checkout-summary">
                        <div className="checkout-section">
                            <div className="section-title">ĐƠN HÀNG ({cartItems.length})</div>
                            <div className="order-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="order-item">
                                        <div className="oi-image"><img src={item.image} alt="" /></div>
                                        <div className="oi-details">
                                            <div className="oi-name">{item.title}</div>
                                            <div className="oi-meta">{item.color} | {item.size} | x{item.quantity}</div>
                                            <div className="oi-price">{(item.price * item.quantity).toLocaleString()}đ</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-row"><span>Tạm tính</span><b>{subtotal.toLocaleString()}đ</b></div>
                            <div className="summary-row"><span>Phí vận chuyển</span><b>{shippingFee.toLocaleString()}đ</b></div>

                            {/* Discount Rows */}
                            {shippingDiscount > 0 && (
                                <div className="summary-row" style={{ color: 'var(--shipping-color)' }}>
                                    <span>Giảm phí vận chuyển</span>
                                    <b>-{shippingDiscount.toLocaleString()}đ</b>
                                </div>
                            )}
                            {orderDiscount > 0 && (
                                <div className="summary-row" style={{ color: 'var(--primary-color)' }}>
                                    <span>Voucher giảm giá</span>
                                    <b>-{orderDiscount.toLocaleString()}đ</b>
                                </div>
                            )}

                            <div className="summary-row total"><span>Tổng cộng</span><span>{total.toLocaleString()}đ</span></div>
                            <button className="place-order-btn">ĐẶT HÀNG</button>
                        </div>
                    </div>

                    {/* Voucher Modal */}
                    {showVoucherModal && (
                        <div className="modal-overlay" onClick={() => setShowVoucherModal(false)}>
                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <span>Chọn 5S Fashion Voucher</span>
                                    <span className="modal-close" onClick={() => setShowVoucherModal(false)}>&times;</span>
                                </div>
                                <div className="modal-body">

                                    <div className="voucher-section-title">Mã Miễn Phí Vận Chuyển</div>
                                    {availableVouchers.filter(v => v.type === 'shipping').map(v => (
                                        <label key={v.id} className={`voucher-card type-shipping ${selectedShippingVoucherId === v.id ? 'active' : ''}`}
                                            onClick={(e) => { e.preventDefault(); toggleShippingVoucher(v.id); }}
                                        >
                                            <input type="radio" className="voucher-radio" checked={selectedShippingVoucherId === v.id} readOnly />
                                            <div className="voucher-info">
                                                <div className="voucher-code">{v.code}</div>
                                                <div className="voucher-desc">{v.desc}</div>
                                            </div>
                                            <div className="voucher-amount">-{v.amount.toLocaleString()}đ</div>
                                        </label>
                                    ))}

                                    <div className="voucher-section-title">Mã Giảm Giá / Hoàn Xu</div>
                                    {availableVouchers.filter(v => v.type === 'order').map(v => (
                                        <label key={v.id} className={`voucher-card type-order ${selectedOrderVoucherId === v.id ? 'active' : ''}`}
                                            onClick={(e) => { e.preventDefault(); toggleOrderVoucher(v.id); }}
                                        >
                                            <input type="radio" className="voucher-radio" checked={selectedOrderVoucherId === v.id} readOnly />
                                            <div className="voucher-info">
                                                <div className="voucher-code">{v.code}</div>
                                                <div className="voucher-desc">{v.desc}</div>
                                            </div>
                                            <div className="voucher-amount">-{v.amount.toLocaleString()}đ</div>
                                        </label>
                                    ))}

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={() => setShowVoucherModal(false)}>HUỶ</button>
                                    <button type="button" className="btn-primary" onClick={() => setShowVoucherModal(false)}>ĐỒNG Ý</button>
                                </div>
                            </div>
                        </div>
                    )}

                </form>
            </div>
        </Layout>
    );
};

export default Checkout;
