import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { getInventoryInvoice } from '../../../services/catalogApi';

const WarehouseInvoice = () => {
    const { id } = useParams(); // Should be invoice ID or transaction ID
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadInvoice = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getInventoryInvoice(id);
                if (isMounted) {
                    setInvoice(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Khong the tai hoa don nhap');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadInvoice();
        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return <AdminLayout>Dang tai hoa don...</AdminLayout>;
    }

    if (error || !invoice) {
        return <AdminLayout>{error || 'Khong tim thay hoa don'}</AdminLayout>;
    }

    return (
        <AdminLayout title={`Chi Tiết Hóa Đơn Nhập #${invoice.id}`}>
            <div className="admin-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        ← Quay Lại
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => window.print()}
                        style={{ padding: '8px 20px' }}
                    >
                        In Hóa Đơn
                    </button>
                </div>

                {/* Invoice Content */}
                <div style={{ padding: '40px', border: '1px solid #eee', borderRadius: '8px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Hóa Đơn Nhập Kho</h1>
                        <p style={{ color: '#666' }}>Ngày nhập: {invoice.date}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#DA251D' }}>Nhà Cung Cấp</h3>
                            <p><strong>{invoice.supplier.name}</strong></p>
                            <p>{invoice.supplier.address}</p>
                            <p>SĐT: {invoice.supplier.phone}</p>
                            <p>Email: {invoice.supplier.email}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>Thông Tin Nhập</h3>
                            <p>Mã Phiếu: <strong>#{invoice.id}</strong></p>
                            <p>Người tạo: {invoice.creator}</p>
                            <p>Ghi chú: {invoice.note}</p>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>STT</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Sản Phẩm</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>ĐVT</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Số Lượng</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Đơn Giá</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Thành Tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{index + 1}</td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                                        <small style={{ color: '#888' }}>SKU: {item.sku}</small>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.unit}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>{item.quantity}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>{item.unitPrice.toLocaleString('vi-VN')}₫</td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>{item.total.toLocaleString('vi-VN')}₫</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="5" style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>Tổng Cộng:</td>
                                <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#DA251D' }}>
                                    {invoice.totalAmount.toLocaleString('vi-VN')}₫
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '60px' }}>Người Giao Hàng</p>
                            <p>(Ký, họ tên)</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '60px' }}>Người Lập Phiếu</p>
                            <p>{invoice.creator}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default WarehouseInvoice;
