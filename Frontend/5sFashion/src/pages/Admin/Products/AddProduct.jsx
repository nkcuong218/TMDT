import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { createProduct, getCategories } from '../../../services/catalogApi';
import './AddProduct.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const [sizeInput, setSizeInput] = useState('');
    const [colorInput, setColorInput] = useState('');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        categoryId: '',
        price: '',
        originalPrice: '',
        stock: 0,
        colors: [],
        sizes: [],
        descriptionDetails: {
            highlights: '',
            material: '',
            fit: '',
            careInstructions: ''
        },
        image: null
    });

    React.useEffect(() => {
        let isMounted = true;

        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await getCategories();
                if (!isMounted) {
                    return;
                }

                setCategories(data || []);
                if (data?.length) {
                    setFormData((prev) => ({ ...prev, categoryId: String(data[0].id) }));
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Không thể tải danh mục');
                }
            } finally {
                if (isMounted) {
                    setLoadingCategories(false);
                }
            }
        };

        loadCategories();
        return () => {
            isMounted = false;
        };
    }, []);

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

    const handleDescriptionDetailChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            descriptionDetails: {
                ...prev.descriptionDetails,
                [field]: value
            }
        }));
    };

    const addTag = (field, value) => {
        const normalizedValue = value.trim();
        if (!normalizedValue) return;

        setFormData(prev => {
            if (prev[field].includes(normalizedValue)) return prev;

            return {
                ...prev,
                [field]: [...prev[field], normalizedValue]
            };
        });
    };

    const removeTag = (field, tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter(tag => tag !== tagToRemove)
        }));
    };

    const handleTagKeyDown = (e, field, inputValue, clearInput) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(field, inputValue);
            clearInput('');
        }
    };

    const slugify = (value) => {
        return value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const cleanSlug = slugify(formData.name || formData.sku || 'san-pham');
            const payload = {
                name: formData.name,
                slug: `${cleanSlug}-${Date.now()}`,
                skuRoot: formData.sku,
                categoryId: Number(formData.categoryId),
                brand: '5S Fashion',
                basePrice: Number(formData.price || 0),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price || 0),
                descriptionHighlights: formData.descriptionDetails.highlights,
                descriptionMaterial: formData.descriptionDetails.material,
                descriptionFit: formData.descriptionDetails.fit,
                descriptionCare: formData.descriptionDetails.careInstructions,
            };

            await createProduct(payload);
            alert('Đã thêm sản phẩm thành công!');
            navigate('/admin/products');
        } catch (err) {
            setError(err.message || 'Tạo sản phẩm thất bại');
        }
    };

    return (
        <AdminLayout title="Thêm Sản Phẩm Mới">
            <div className="admin-card">
                <form onSubmit={handleSubmit} className="add-product-form">
                    {error && <p style={{ color: 'red' }}>{error}</p>}

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
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="form-control"
                                disabled={loadingCategories}
                            >
                                {!loadingCategories && categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
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
                        <div className="form-group">
                            <label className="form-label">Giá Niêm Yết (VNĐ)</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                className="form-input form-control"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Kích Cỡ</label>
                            <div className="tag-input-wrapper">
                                <div className="tag-list">
                                    {formData.sizes.map(size => (
                                        <span key={size} className="tag-item">
                                            {size}
                                            <button type="button" onClick={() => removeTag('sizes', size)}>&times;</button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={sizeInput}
                                    onChange={(e) => setSizeInput(e.target.value)}
                                    onKeyDown={(e) => handleTagKeyDown(e, 'sizes', sizeInput, setSizeInput)}
                                    onBlur={() => {
                                        addTag('sizes', sizeInput);
                                        setSizeInput('');
                                    }}
                                    className="form-input form-control"
                                    placeholder="Nhập size rồi nhấn Enter (VD: S, M, L)"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Màu Sắc</label>
                            <div className="tag-input-wrapper">
                                <div className="tag-list">
                                    {formData.colors.map(color => (
                                        <span key={color} className="tag-item">
                                            {color}
                                            <button type="button" onClick={() => removeTag('colors', color)}>&times;</button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    onKeyDown={(e) => handleTagKeyDown(e, 'colors', colorInput, setColorInput)}
                                    onBlur={() => {
                                        addTag('colors', colorInput);
                                        setColorInput('');
                                    }}
                                    className="form-input form-control"
                                    placeholder="Nhập màu rồi nhấn Enter (VD: Đen, Trắng)"
                                />
                            </div>
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
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Điểm Nổi Bật</label>
                                <textarea
                                    value={formData.descriptionDetails.highlights}
                                    onChange={(e) => handleDescriptionDetailChange('highlights', e.target.value)}
                                    rows="3"
                                    className="form-control"
                                    placeholder="VD: Chống nhăn, thoáng khí, dễ phối đồ"
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Chất Liệu</label>
                                <textarea
                                    value={formData.descriptionDetails.material}
                                    onChange={(e) => handleDescriptionDetailChange('material', e.target.value)}
                                    rows="3"
                                    className="form-control"
                                    placeholder="VD: 95% Cotton, 5% Spandex"
                                ></textarea>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Form Dáng</label>
                                <textarea
                                    value={formData.descriptionDetails.fit}
                                    onChange={(e) => handleDescriptionDetailChange('fit', e.target.value)}
                                    rows="3"
                                    className="form-control"
                                    placeholder="VD: Regular fit, tôn dáng vai"
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Hướng Dẫn Bảo Quản</label>
                                <textarea
                                    value={formData.descriptionDetails.careInstructions}
                                    onChange={(e) => handleDescriptionDetailChange('careInstructions', e.target.value)}
                                    rows="3"
                                    className="form-control"
                                    placeholder="VD: Giặt máy chế độ nhẹ, không sấy nhiệt cao"
                                ></textarea>
                            </div>
                        </div>
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
