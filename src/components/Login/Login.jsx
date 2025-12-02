import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const localStorageSetItem = (item) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("accessToken", JSON.stringify(item.token));
    }
  };

  const tokenExtractor = () => {
    try {
      if (typeof window !== "undefined") {
        const storedToken = window.localStorage.getItem("accessToken");
        return storedToken ? JSON.parse(storedToken) : null;
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const token = tokenExtractor();
    if (token) {
      navigate("/home");
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      console.log("Resultado del login:", result);

      if (response.ok) {
        setMessage("Inicio de sesión exitoso");
        localStorageSetItem(result.payload);
        setTimeout(() => {
          navigate("/home");
        }, 1200);
      } else {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("accessToken");
        }
        setError(result?.status || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("accessToken");
      }
      setError("Error del servidor. Intente más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-header">
          <div className="login-logo-circle">CD</div>
          <div>
            <h2>Iniciar sesión</h2>
            <p className="login-subtitle">Accedé a tu panel de puntos</p>
          </div>
        </div>

        {error && <p className="alert alert-error">{error}</p>}
        {message && <p className="alert alert-success">{message}</p>}

        <label className="login-label">
          Correo electrónico
          <input
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="login-label">
          Contraseña
          <input
            type="password"
            name="password"
            placeholder="Tu contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando..." : "Entrar"}
        </button>

        <p className="info-text">
          ¿Problemas para iniciar sesión? Verificá que el correo y la contraseña
          sean correctos.
        </p>
      </form>
    </div>
  );
};