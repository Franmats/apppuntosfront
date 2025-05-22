import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Slider } from "../Slider/Slider";
import { FaGift, FaShoppingCart, FaMapMarkerAlt, FaQuestionCircle } from 'react-icons/fa';
import { FiInstagram, FiFacebook, FiTwitter, FiLogOut, FiSettings } from 'react-icons/fi';

const LoadingSpinner = () => (
    <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando su información...</p>
    </div>
);

const Header = ({ profile }) => (
    <header className="header">
        <div className="logo-container">
            <img src="/logo.png" alt="Logo" />
            <h1>AppPuntos</h1>
        </div>
        <p className="welcome">¡Bienvenido, {profile.name}!</p>
        <div className="points-container">
            <div className="points-box">
                <p className="label">Mis Puntos Disponibles</p>
                <p className="points">{profile.puntos.toLocaleString()}</p>
            </div>
            <div className="buttons-front">
                <a className="button-1" href="/home">
                    <span>Actualizar</span>
                </a>
                <a className="button-1" href="/profile">
                    <span>Movimientos</span>
                </a>
            </div>
        </div>
    </header>
);

const QuickActions = () => {
    const actions = [
        { icon: <FaGift />, label: "Regalos", path: "/regalos" },
        { icon: <FaShoppingCart />, label: "Ofertas", path: "/ofertas" },
        { icon: <FaMapMarkerAlt />, label: "Comercios", path: "/comercios" },
        { icon: <FaQuestionCircle />, label: "Ayuda", path: "/ayuda" }
    ];

    return (
        <div className="icon-grid">
            {actions.map((action, index) => (
                <a key={index} href={action.path} className="icon-card">
                    <div className="icon">{action.icon}</div>
                    <p>{action.label}</p>
                </a>
            ))}
        </div>
    );
};

const SocialLinks = () => (
    <div className="social-links">
        <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
            <FiInstagram /> Instagram
        </a>
        <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
            <FiFacebook /> Facebook
        </a>
        <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
            <FiTwitter /> Twitter
        </a>
    </div>
);

export const Home = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const tokenExtractor = () => {
        try {
            if (typeof window !== "undefined") {
                const storedToken = window.localStorage.getItem("accessToken");
                return storedToken ? JSON.parse(storedToken) : null;
            }
        } catch (error) {
            console.error("Error extracting token:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = tokenExtractor();
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await fetch("https://router.sgilibra.com:9443/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await response.json();
                setProfile(data.payload);
            } catch (error) {
                setError(error.message);
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="dashboard">
            <Header profile={profile} />
            <QuickActions />
            
            <section className="promotions-section">
                <h2 className="promotions-title">Promociones Destacadas</h2>
                <Slider />
            </section>

            <SocialLinks />

            <div className="bottom-buttons">
                <button className="close-button" onClick={() => navigate("/logout")}>
                    <FiLogOut /> Cerrar Sesión
                </button>
                <button className="settings-button" onClick={() => navigate("/settings")}>
                    <FiSettings /> Configuración
                </button>
            </div>
        </div>
    );
};