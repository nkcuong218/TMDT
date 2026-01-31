import React, { useState, useEffect } from 'react';
import './Hero.css';

// Import images
import banner1 from '../../assets/Herobanner1.jpg';
import banner2 from '../../assets/Herobanner2.jpg'; // Assuming this exists or similar
import banner3 from '../../assets/Herobanner3.jpg';

const slides = [
    {
        id: 1,
        image: banner1,
        cta: 'Mua Ngay'
    },
    {
        id: 2,
        image: banner3,
        cta: 'Xem Chi Tiết'
    },
    {
        id: 3,
        image: banner2,
        cta: 'Khám Phá'
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero-section">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="hero-overlay">
                        <div className="hero-content">
                            <div className="hero-subtitle">{slide.subtitle}</div>
                            <h1 className="hero-title">{slide.title}</h1>
                            <button className="btn btn-primary">{slide.cta}</button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="slider-controls">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
