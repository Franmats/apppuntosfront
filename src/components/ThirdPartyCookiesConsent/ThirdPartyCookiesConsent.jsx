import React, { useState, useEffect } from "react";

export function ThirdPartyCookiesConsent({ onAccept }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem("thirdPartyCookiesAccepted");
      if (!accepted) {
        setShow(true);
      } else {
        onAccept();
      }
    } catch (e) {
      setShow(true);
    }
  }, [onAccept]);

  function handleAccept() {
    try {
      localStorage.setItem("thirdPartyCookiesAccepted", "true");
    } catch (e) {
      // Si no se puede guardar, no hay problema, solo no persistirá
    }
    setShow(false);
    onAccept();
  }

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        background: "#eee",
        padding: 20,
        width: "100%",
        textAlign: "center",
        zIndex: 9999,
        boxShadow: "0 -2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <p>
        Para continuar, por favor habilite las cookies de terceros en su
        navegador y luego presione <strong>"Aceptar"</strong>.
      </p>
      <button onClick={handleAccept}>Aceptar</button>
    </div>
  );
}