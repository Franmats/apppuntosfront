import React, { useEffect, useRef, useState } from "react";
import "./Slider.css";

export const Slider = () => {
    const [promos, setPromos] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const response = await fetch("https://router.sgilibra.com:9443/promos");
                const data = await response.json();
                setPromos(data.payload);
            } catch (err) {
                console.error("Error al cargar promociones:", err);
            }
        };

        fetchPromos();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
                // Reinicio al final
                if (
                    scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
                    scrollRef.current.scrollWidth
                ) {
                    scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [promos]);

    return (
        <div className="slider-container">
            {promos.length > 0 ? (
                <div className="slider-scroll" ref={scrollRef}>
                    {promos.map((promo, index) => (
                        <div key={index} className="slide">
                            <img src={promo.image} alt={promo.name} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="slider-loading">Cargando promociones...</p>
            )}
        </div>
    );
};

