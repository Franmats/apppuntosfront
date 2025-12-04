import React, { useEffect, useState } from "react";
import "./Installapp.css";

export const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [hasInstalled, setHasInstalled] = useState(
    () => window.localStorage.getItem("pwaInstalled") === "true"
  );

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
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
      setHasInstalled(true);
      window.localStorage.setItem("pwaInstalled", "true");
    } else {
      console.log("Usuario canceló");
    }

    setDeferredPrompt(null);
  };

  // Para iPhone (Safari)
  const isIos = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isInStandalone = window.navigator.standalone === true;

  // Si ya la instaló, no mostramos más el botón
  if (hasInstalled) return null;

  if (isIos && !isInStandalone) {
    return (
      <div className="install-ios">
        📱 Para instalar la app:{" "}
        Presioná <strong>Compartir → Agregar a inicio</strong>
      </div>
    );
  }

  // 🔥 El botón se muestra SIEMPRE, pero se desactiva hasta que haya deferredPrompt
  return (
    <button
      className="install-app-button"
      onClick={installApp}
      disabled={!deferredPrompt}
    >
      Instalar App
    </button>
  );
};
