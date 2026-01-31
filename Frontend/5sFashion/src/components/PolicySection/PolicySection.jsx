import React from 'react';
import './PolicySection.css';

const PolicySection = () => {
    const policies = [
        {
            id: 1,
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
            ),
            title: 'MIỄN PHÍ GIAO HÀNG ĐƠN TỪ 499K',
            desc: 'Giao hàng nhanh chóng'
        },
        {
            id: 2,
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
            ),
            title: 'ĐỔI HÀNG LINH HOẠT',
            desc: 'Trong vòng 15 ngày kể từ ngày mua'
        },
        {
            id: 3,
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                </svg>
            ),
            title: 'BẢO HÀNH SẢN PHẨM',
            desc: 'Trong vòng 6 tháng kể từ ngày mua'
        },
        {
            id: 4,
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
            ),
            title: 'TƯ VẤN NHANH CHÓNG',
            desc: 'Hỗ trợ từ 7h30-23h mỗi ngày'
        }
    ];

    return (
        <section className="policy-section">
            <div className="container">
                <div className="policy-grid">
                    {policies.map(item => (
                        <div key={item.id} className="policy-item">
                            <div className="policy-icon">
                                {item.icon}
                            </div>
                            <h3 className="policy-title">{item.title}</h3>
                            <p className="policy-desc">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PolicySection;
