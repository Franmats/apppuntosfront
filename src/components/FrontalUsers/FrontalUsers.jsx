import "./FrontalUsers.css";
import React, { useState, useEffect } from "react";

export const FrontalUsers = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://router.sgilibra.com:9443/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include" 
                });

                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData.payload);
                } else {
                    console.log("Error al cargar datos");
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="users-container">
            <h2>Lista de Usuarios</h2>
            <div className="cards-grid">
                {data.map((user, index) => (
                    <div key={index} className="user-card">
                        <h3>{user._id}</h3>
                        <h3>{user.name}</h3>
                        <p><strong>Contraseña:</strong> {user.password}</p>
                        <p><strong>Puntos:</strong> {user.puntos}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};