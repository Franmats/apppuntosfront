import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Slider } from "../Slider/Slider";


export const Home = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

     const tokenExtractor = () => {
        try {
            if (typeof window !== "undefined") {
                const storedToken = window.localStorage.getItem("accessToken");

                if (storedToken) {
                    const user = JSON.parse(storedToken);
                    return user;
                } else {
                    return null;
                }
            }
        } catch (error) {
            return null;
        }
    };
    useEffect(() => {
        const fetchProfile = async () => {


            try {
                const token = tokenExtractor();
                const response = await fetch("https://router.sgilibra.com:9443/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data.payload);
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error al cargar el perfil:");
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="dashboard">
            <header className="header">
                <h1>LOGO empresa</h1>
                <p className="welcome">Bienvenido!! {profile.name}</p>
                <div className="points-container">
                    <div className="points-box">
                        <p className="label">Mis Puntos</p>
                        <p className="points">{profile.puntos}</p>
                    </div>
                    <div className="buttons-front">
                           <a className="button-1" href="/home">Actualizar</a>
                           <a className="button-1" href="/profile">Movimientos</a>
                    </div>
                 
                </div>
            </header>

                            <div className="icon-grid">
                    <a href="/regalos" className="icon-card">
                        <div className="icon">📦</div>
                        <p>Regalos</p>
                    </a>
                    <a href="/ofertas" className="icon-card">
                        <div className="icon">🛒</div>
                        <p>Ofertas</p>
                    </a>
                    <a href="/comercios" className="icon-card">
                        <div className="icon">📍</div>
                        <p>Comercios</p>
                    </a>
                    <a href="/ayuda" className="icon-card">
                        <div className="icon">❓</div>
                        <p>Ayuda</p>
                    </a>
                </div>

            {/* Promociones - componente externo */}
            <Slider />
            <div className="social-links">
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
                <a href="#">Twitter</a>
            </div>

            <div className="bottom-buttons">
                <button className="close-button" ><a href="/logout">Cerrar Sesión</a></button>
                <button className="settings-button">Configuración</button>
            </div>
        </div>
    );
};