import React, { useEffect, useState } from "react";
import "./Installapp.css";

export const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("PWA instalada");
    } else {
      console.log("Usuario canceló");
    }

    setIsVisible(false);
    setDeferredPrompt(null);
  };

  // Para iPhone (Safari)
  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isInStandalone = window.navigator.standalone === true;

  if (isIos && !isInStandalone) {
    return (
      <div className="install-ios">
        📱 Para instalar la app:  
        Presioná <strong>Compartir → Agregar a inicio</strong>
      </div>
    );
  }

  return (
    <>
      {isVisible && (
        <button className="install-app-button" onClick={installApp}>
          Instalar App
        </button>
      )}
    </>
  );
};