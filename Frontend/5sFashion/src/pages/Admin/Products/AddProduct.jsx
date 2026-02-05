import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: 'Nam',
        price: '',
        stock: 0,
        description: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        // Handle image file selection (mock for now)
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files[0] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting Product:', formData);
        // Here you would call an API
        alert('Đã thêm sản phẩm thành công! (Mô phỏng)');
        navigate('/admin/products');
    };

    return (
        <AdminLayout title="Thêm Sản Phẩm Mới">
            <div className="admin-card">
                <form onSubmit={handleSubmit} className="add-product-form">

                    <div className="form-group">
                        <label className="form-label">Tên Sản Phẩm</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input form-control"
                            required
                            placeholder="Nhập tên sản phẩm"
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Mã SKU</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className="form-input form-control"
                                required
                                placeholder="VD: AKG123"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Danh Mục</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Bé Trai">Bé Trai</option>
                                <option value="Bé Gái">Bé Gái</option>
                                <option value="Phụ Kiện">Phụ Kiện</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Giá Bán (VNĐ)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="form-input form-control"
                                required
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Hình Ảnh Sản Phẩm</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ width: '100%', padding: '8px' }}
                        />
                        {formData.image && (
                            <div className="image-preview">
                                <p>Đã chọn: {formData.image.name}</p>
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label">Mô Tả Chi Tiết</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            className="form-control"
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="btn-cancel"
                        >
                            Hủy Bỏ
                        </button>
                        <button
                            type="submit"
                            className="btn-primary btn-submit-custom"
                        >
                            Lưu Sản Phẩm
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
};

export default AddProduct;
