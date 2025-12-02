import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Slider } from "../Slider/Slider";
import { FaGift, FaShoppingCart, FaMapMarkerAlt, FaQuestionCircle } from "react-icons/fa";
import { FiInstagram, FiFacebook, FiTwitter, FiLogOut, FiSettings } from "react-icons/fi";

/* Spinner grande (pantalla completa) */
const LoadingSpinner = () => (
  <div className="loading">
    <div className="loading-spinner"></div>
    <p>Cargando su información...</p>
  </div>
);

/* Spinner pequeño (para los puntos) */
export const SmallSpinner = () => <div className="small-spinner"></div>;

const apiUrl = import.meta.env.VITE_API_URL;

/* HEADER */
const Header = ({ profile, onRefresh, isRefreshing, showSpinner }) => (
  <header className="header">
    <div className="logo-container">
      <img src="/shopicon.png" alt="Logo" />
      <h1>Cerutti Deportes</h1>
    </div>

    <p className="welcome">¡Bienvenido, {profile.name}!</p>

    <div className="points-container">
      <div className="points-box">
        <p className="label">Mis Puntos Disponibles</p>

        {/* 🔥 SPINNER exacto en lugar de los puntos */}
        <p className="points">
          {isRefreshing && showSpinner ? (
            <SmallSpinner />
          ) : (
            profile.puntos.toLocaleString()
          )}
        </p>
      </div>

      <div className="buttons-front">
        <button
          className="button-1"
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </button>

        <a className="button-1" href="/profile">
          <span>Movimientos</span>
        </a>
      </div>
    </div>
  </header>
);

/* ACCIONES RÁPIDAS */
const QuickActions = () => {
  const actions = [
    { icon: <FaGift />, label: "Regalos", path: "/regalos" },
    { icon: <FaShoppingCart />, label: "Canjear", path: "/products/ofertas" },
    { icon: <FaMapMarkerAlt />, label: "Comercios", path: "/comercios" },
    { icon: <FaQuestionCircle />, label: "Ayuda", path: "/ayuda" },
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

/* REDES */
const SocialLinks = () => (
  <div className="social-links">
    <a href="https://instagram.com" className="social-link" target="_blank">
      <FiInstagram /> Instagram
    </a>
    <a href="https://facebook.com" className="social-link" target="_blank">
      <FiFacebook /> Facebook
    </a>
    <a href="https://twitter.com" className="social-link" target="_blank">
      <FiTwitter /> Twitter
    </a>
  </div>
);

export const Home = () => {
  const [profile, setProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);        // Loading inicial
  const [isRefreshing, setIsRefreshing] = useState(false); // Loading de puntos
  const [showSpinner, setShowSpinner] = useState(false);   // Mostrar spinner pequeño

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const tokenExtractor = () => {
    const storedToken = window.localStorage.getItem("accessToken");
    return storedToken ? JSON.parse(storedToken) : null;
  };

  /* Obtener perfil */
  const fetchProfile = async () => {
    try {
      const token = tokenExtractor();
      if (!token) throw new Error("No token found");

      const response = await fetch(`${apiUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setProfile(data.payload);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  /* Carga inicial */
  useEffect(() => {
    fetchProfile().then(() => setIsLoading(false));
  }, []);

  /* 🔥 Actualizar puntos */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setShowSpinner(false);

    /* Retardo suave (evita flash de spinner si la carga es rápida) */
    const timeout = setTimeout(() => setShowSpinner(true), 250);

    await fetchProfile();

    clearTimeout(timeout);
    setIsRefreshing(false);
    setShowSpinner(false);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="dashboard">
      <Header
        profile={profile}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        showSpinner={showSpinner}  // 🔥 IMPORTANTE
      />

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
