import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';

const WarehouseImport = () => {
    const navigate = useNavigate();

    // Mock Data
    const suppliers = [
        { id: 1, name: 'Công Ty TNHH May Mặc Việt Nam' },
        { id: 2, name: 'Xưởng May Hà Nội' },
        { id: 3, name: 'Nhà Cung Cấp Vải Sợi' }
    ];

    const products = [
        { id: 1, name: 'Áo Khoác Gió Nam Pro-DWR 5S', sku: 'AKG123', variants: ['L - Đen', 'M - Đen', 'L - Xanh'] },
        { id: 2, name: 'Quần Short Kaki Nam 5S', sku: 'QSK456', variants: ['32 - Be', '30 - Be'] },
        { id: 3, name: 'Váy Len Nữ', sku: 'VLN789', variants: ['M - Đỏ'] }
    ];

    const [formData, setFormData] = useState({
        supplierId: '',
        note: '',
        items: [
            { id: 1, productId: '', variant: '', quantity: 1, unitPrice: 0 }
        ]
    });

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { id: Date.now(), productId: '', variant: '', quantity: 1, unitPrice: 0 }]
        }));
    };

    const handleRemoveItem = (id) => {
        if (formData.items.length === 1) return;
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    const handleItemChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Import Data:', formData);
        alert('Đã tạo phiếu nhập kho thành công!');
        navigate('/admin/warehouse');
    };

    return (
        <AdminLayout title="Tạo Phiếu Nhập Kho">
            <div className="admin-card">
                <form onSubmit={handleSubmit} style={{ maxWidth: '1000px' }}>

                    {/* General Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Nhà Cung Cấp</label>
                            <select
                                className="form-input"
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                value={formData.supplierId}
                                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                                required
                            >
                                <option value="">-- Chọn Nhà Cung Cấp --</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Ghi Chú</label>
                            <input
                                type="text"
                                className="form-input"
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                placeholder="VD: Nhập hàng đợt 1 tháng 11"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Product List */}
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Danh Sách Sản Phẩm</h3>

                    {formData.items.map((item, index) => (
                        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr 1.5fr 0.5fr', gap: '15px', marginBottom: '15px', alignItems: 'end' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '12px', color: '#666' }}>Sản Phẩm</label>
                                <select
                                    className="form-input"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    value={item.productId}
                                    onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                                    required
                                >
                                    <option value="">Chọn Sản Phẩm</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '12px', color: '#666' }}>Biến Thể</label>
                                <select
                                    className="form-input"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    value={item.variant}
                                    onChange={(e) => handleItemChange(item.id, 'variant', e.target.value)}
                                    disabled={!item.productId}
                                    required
                                >
                                    <option value="">Chọn Biến Thể</option>
                                    {item.productId && products.find(p => p.id == item.productId)?.variants.map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '12px', color: '#666' }}>Số Lượng</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '12px', color: '#666' }}>Đơn Giá Nhập</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    min="0"
                                    value={item.unitPrice}
                                    onChange={(e) => handleItemChange(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                                    required
                                />
                            </div>
                            <div style={{ paddingBottom: '5px' }}>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    style={{ color: 'red', cursor: 'pointer', fontSize: '18px' }}
                                    title="Xóa dòng này"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddItem}
                        style={{ padding: '8px 15px', background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '30px', fontWeight: '500' }}
                    >
                        + Thêm Sản Phẩm Khác
                    </button>

                    {/* Summary */}
                    <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>Tổng Tiền Nhập:</span>
                        <span style={{ fontSize: '24px', fontWeight: '700', color: '#DA251D' }}>{calculateTotal().toLocaleString('vi-VN')}₫</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/warehouse')}
                            style={{ padding: '12px 24px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Hủy Bỏ
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ padding: '12px 30px', background: '#DA251D', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Hoàn Tất Nhập Kho
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
};

export default WarehouseImport;
