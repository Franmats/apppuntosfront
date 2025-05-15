import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const localStorageSetItem = (item) => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("accessToken", JSON.stringify(item));
        }
    };

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
        const checkAuth = async () => {
            try {
                const token = tokenExtractor();

                if (!token) return;

                const res = await fetch("https://router.sgilibra.com:9443/auth", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    navigate("/home");
                }
            } catch (error) {
                console.error("No autenticado:", error);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("https://router.sgilibra.com:9443/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const result = await response.json();
            console.log("Resultado del login:", result);
            if (response.ok) {
                setMessage("Inicio de sesión exitoso");
                localStorageSetItem(result.payload);
                setTimeout(() => {
                    navigate("/home");
                }, 1500);
            } else {
                setError(result?.status || "Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error en login:", error);
            setError("Error del servidor. Intente más tarde.");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Entrar</button>
                <p className="info-text">
                    ¿Problemas para iniciar sesión? Asegúrate de que el correo y la contraseña sean correctos.
                </p>
                {message && <p className="success">{message}</p>}
            </form>
        </div>
    );
};