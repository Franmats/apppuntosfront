import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const BackIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
    </svg>
);

const LoadingSpinner = () => (
    <div className="loading-container">
        <div className="loading-spinner" />
        <p>Cargando su información...</p>
    </div>
);

const formatDate = (dateString) => {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

export const HomePage = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

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
        return (
            <>
                <LoadingSpinner />
                <button className="back-button" onClick={handleBack} aria-label="Volver">
                    <BackIcon />
                </button>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="error-container">
                    <p>Error: {error}</p>
                </div>
                <button className="back-button" onClick={handleBack} aria-label="Volver">
                    <BackIcon />
                </button>
            </>
        );
    }

    return (
        <div className="home-container">
            <h2>Perfil del Usuario</h2>
            <div className="profile-item">
                <h3>{profile.name}</h3>
                <p>{profile.email}</p>
                <p>
                    <strong>Puntos Disponibles:</strong>{' '}
                    <span className={profile.puntos >= 0 ? 'positive' : 'negative'}>
                        {profile.puntos.toLocaleString()}
                    </span>
                </p>
            </div>

            <h3>Historial de Movimientos</h3>
            <div className="movements-list">
                {profile.pointsHistory && profile.pointsHistory.length > 0 ? (
                    profile.pointsHistory.map((movement, index) => (
                        <div key={index} className="movement-item">
                            <p>
                                <strong>Fecha:</strong>
                                <span>{movement.date}</span>
                            </p>
                            <p>
                                <strong>Puntos:</strong>
                                <span className={movement.amount > 0 ? 'positive' : 'negative'}>
                                    {movement.amount > 0 ? `+${movement.amount.toLocaleString()}` : movement.amount.toLocaleString()}
                                </span>
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="movement-item">
                        <p>No hay movimientos disponibles.</p>
                    </div>
                )}
            </div>
            
            <button className="back-button" onClick={handleBack} aria-label="Volver">
                <BackIcon />
            </button>
        </div>
    );
};