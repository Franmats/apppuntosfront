import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { ThirdPartyCookiesConsent } from "../ThirdPartyCookiesConsent/ThirdPartyCookiesConsent";

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [canContinue, setCanContinue] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://router.sgilibra.com:9443/auth", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          // Si ya hay sesión activa, redirige al home
          navigate("/home");
        }
      } catch (error) {
        console.error("No autenticado:", error);
      }
    };

    // Sólo checkear autenticación si el usuario puede continuar
    if (canContinue) {
      checkAuth();
    }
  }, [navigate, canContinue]);

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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Inicio de sesión exitoso");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setError(result?.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error del servidor. Intente más tarde.");
    }
  };

  // Si no aceptó las third-party cookies, mostrar aviso primero
  if (!canContinue) {
    return <ThirdPartyCookiesConsent onAccept={() => setCanContinue(true)} />;
  }

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
          ¿Problemas para iniciar sesión? Asegúrate de que el correo y la
          contraseña sean correctos.
        </p>
        {message && <p className="success">{message}</p>}
      </form>
    </div>
  );
};
