import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
export const HomePage = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("https://router.sgilibra.com:9443/profile", {
                    method: "GET",
                    credentials: "include", // Enviar la cookie para autenticar
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data.payload); 
                }else{
                    navigate("/login");
                }
            } catch (error) {
                
                console.error("Error al cargar el perfil:");
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="home-container">
            <h2>Perfil del Usuario</h2>
            <div className="profile-item">
                <h3>{profile.name}</h3>
                <p>{profile.email}</p>
                <p><strong>Puntos:</strong> {profile.puntos}</p>
            </div>

            <h3>Últimos Movimientos de Puntos</h3>
            <div className="movements-list">
                {profile.pointsHistory && profile.pointsHistory.length > 0 ? (
                    profile.pointsHistory.map((i, index) => (
                        <div key={index} className="movement-item">
                            <p><strong>Fecha:</strong> {i.date}</p>
                            <p><strong>Movimiento:</strong> {i.amount > 0 ? `+${i.amount}` : i.amount}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay movimientos disponibles.</p>
                )}
            </div>
        </div>
    );
};