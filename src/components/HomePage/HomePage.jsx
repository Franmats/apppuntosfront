import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="loading">
    <p>Cargando tu información...</p>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

export const HomePage = () => {
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

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = tokenExtractor();
        if (!token) {
          throw new Error("No se encontró el token. Inicie sesión nuevamente.");
        }

        const response = await fetch(`${apiUrl}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener el perfil");
        }

        const data = await response.json();
        setProfile(data.payload);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [apiUrl]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="promotions-section error-section">
          <p className="error-text">Error: {error}</p>
          <div className="bottom-buttons">
            <button className="close-button" onClick={handleBack}>
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="dashboard">
      {/* HEADER PRINCIPAL */}
      <header className="header">
        <div className="logo-container">
          {/* Si tenés logo, descomentá esta línea y ajustá la ruta */}
          {/* <img src="/logo.svg" alt="Logo" /> */}
          <h1>Cerutti Deportes</h1>
        </div>

        <p className="welcome">Hola, {profile.name}</p>

        <div className="points-container">
          <div className="points-box">
            <p className="label">Puntos disponibles</p>
            <p className="points">
              {profile.puntos?.toLocaleString("es-AR") ?? 0}
            </p>
          </div>

          {/* Si querés agregar botones rápidos, los dejé listos */}
          {/* 
          <div className="buttons-front">
            <button className="button-1" onClick={() => navigate("/promos")}>
              Ver promociones
            </button>
            <button className="button-1" onClick={() => navigate("/perfil")}>
              Mi perfil
            </button>
          </div>
          */}
        </div>
      </header>

      {/* HISTORIAL DE MOVIMIENTOS EN CARD TIPO "PROMOTIONS" */}
      <section className="promotions-section">
        <h2 className="promotions-title">Historial de movimientos</h2>

        {profile.pointsHistory && profile.pointsHistory.length > 0 ? (
          <div className="movements-list">
            {profile.pointsHistory.map((movement, index) => (
              <div key={index} className="movement-item">
                <div className="movement-row">
                  <span className="movement-label">Fecha</span>
                  <span className="movement-value">
                    {formatDate(movement.date)}
                  </span>
                </div>
                <div className="movement-row">
                  <span className="movement-label">Puntos</span>
                  <span
                    className={`movement-amount ${
                      movement.amount > 0 ? "positive" : "negative"
                    }`}
                  >
                    {movement.amount > 0
                      ? `+${movement.amount.toLocaleString("es-AR")}`
                      : movement.amount.toLocaleString("es-AR")}
                  </span>
                </div>
                {movement.description && (
                  <div className="movement-row movement-description">
                    <span className="movement-label">Detalle</span>
                    <span className="movement-value">
                      {movement.description}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-movements">No hay movimientos disponibles.</p>
        )}
      </section>

      {/* BOTONES INFERIORES */}
      <div className="bottom-buttons">
        <button className="close-button" onClick={handleBack}>
          Cerrar
        </button>
      </div>
    </div>
  );
};
