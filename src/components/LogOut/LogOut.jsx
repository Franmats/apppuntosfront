import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const token = localStorage.getItem("accessToken");

            if (token) {
                localStorage.removeItem("accessToken");
                console.log("Token eliminado correctamente");
            } else {
                console.log("No se encontró token para eliminar");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            navigate("/login");
        }
    }, [navigate]);

    return null; 
};