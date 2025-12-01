import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const navigate = useNavigate();
 const tokenStractor = async() => {
        try {
          const storedToken = window.localStorage.getItem("accessToken");
      
          if (storedToken) {
            const user = JSON.parse(storedToken)
            return user
          } else {
            return null; 
          }
        } catch (error) {
          return null;
        }
      }
  useEffect(() => {
    const checkAuth = async () => {
      try {
    
        const token = await tokenStractor();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("accessToken");
          navigate('/login');
        }
      } catch (err) {
        console.error("Error en autenticación:", err);
        localStorage.removeItem("accessToken");
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>; // Puedes poner un spinner aquí si querés
  }

  return <>{children}</>;
};

export default AuthGuard;