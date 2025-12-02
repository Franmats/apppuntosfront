import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Comercios.css";

export const Comercios = () => {
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const productName = location.state?.productName || null;

  // 🔥 MOCK DE COMERCIOS
  const mockComercios = [
    {
      _id: "1",
      name: "Deportes Sucursal 1",
      address: "Av. San Martín 1400",
      city: "Mendoza",
      phone: "261-4558900",
      openingHours: "09:00 - 20:00",
      image: "/locate.jpg",
    },
    {
      _id: "2",
      name: "Cerutti Deportes Sucursal 2",
      address: "Calle Arístides 5950",
      city: "Mendoza",
      phone: "261-4213344",
      openingHours: "10:00 - 21:00",
      image: "/locate.jpg",
    },
    {
      _id: "3",
      name: "Cerutti Deportes Godoy Cruz",
      address: "Las Heras 4300",
      city: "Godoy Cruz",
      phone: "261-4781120",
      openingHours: "10:00 - 22:00",
      image: "/locate.jpg",
    }
  ];

  // 🔥 Simulación de llamada a la API
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setComercios(mockComercios);
      setLoading(false);
    }, 600); // Simula tiempo de red

  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <p>Cargando comercios...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="header">
        <div className="logo-container">
          <img src="/shopicon.png" alt="Logo" />
          <h1>Cerutti Deportes</h1>
        </div>

        <p className="welcome">
          {productName
            ? `Comercios donde podés canjear: ${productName}`
            : "Comercios adheridos donde podés usar tus puntos"}
        </p>
      </header>

      {/* SECCIÓN PRINCIPAL */}
      <section className="promotions-section comercios-section">
        <h2 className="promotions-title">Comercios Disponibles</h2>

        <div className="comercios-list">
          {comercios.map((comercio) => (
            <article key={comercio._id} className="comercio-card">
              {comercio.image && (
                <div className="comercio-image-wrapper">
                  <img
                    src={comercio.image}
                    alt={comercio.name}
                    className="comercio-image"
                  />
                </div>
              )}

              <div className="comercio-info">
                <h3 className="comercio-name">{comercio.name}</h3>

                <p className="comercio-address">
                  {comercio.address}, {comercio.city}
                </p>

                <p className="comercio-hours">Horario: {comercio.openingHours}</p>

                <p className="comercio-phone">Tel: {comercio.phone}</p>

                <div className="comercio-buttons">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${comercio.name} ${comercio.address} ${comercio.city}`
                    )}`}
                    className="button-1 comercio-map-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en mapa
                  </a>

                  <button
                    className="settings-button comercio-back-button"
                    onClick={() => navigate(-1)}
                  >
                    Volver
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="bottom-buttons">
        <button className="close-button" onClick={() => navigate(-1)}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Comercios;
