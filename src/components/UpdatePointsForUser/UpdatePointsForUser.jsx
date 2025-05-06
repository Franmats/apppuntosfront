import React, { useEffect, useState } from "react";
import "./UpdatePointsForUser.css";

export const UpdatePointsForUser = () => {
    const [state, setState] = useState({
        users: [],
        selectedUserId: "",
        newPoints: "",
        message: { text: "", type: "" },
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("https://router.sgilibra.com:9443/", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
            
                });

                const data = await res.json();
                setState((prev) => ({ ...prev, users: data.payload }));
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleUpdatePoints = async () => {
        const { selectedUserId, newPoints } = state;

        if (!selectedUserId || newPoints === "") {
            setState((prev) => ({
                ...prev,
                message: { text: "Completa todos los campos.", type: "error" },
            }));
            return;
        }

        try {
            const res = await fetch("https://router.sgilibra.com:9443/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedUserId,
                    puntos: Number(newPoints),
                }),
            });

            if (res.ok) {
                setState((prev) => ({
                    ...prev,
                    newPoints: "",
                    message: { text: "Puntos actualizados correctamente.", type: "success" },
                }));
            } else {
                setState((prev) => ({
                    ...prev,
                    message: { text: "Error al actualizar puntos.", type: "error" },
                }));
            }
        } catch (error) {
            console.error("Error:", error);
            setState((prev) => ({
                ...prev,
                message: { text: "Error de conexión con el servidor.", type: "error" },
            }));
        }
    };

    return (
        <div className="edit-user-container">
            <h3>Editar Puntos del Usuario</h3>

            <label>Selecciona un usuario:</label>
            <select
                value={state.selectedUserId}
                onChange={(e) =>
                    setState((prev) => ({ ...prev, selectedUserId: e.target.value }))
                }
            >
                <option value="">-- Selecciona --</option>
                {state.users.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.name} ({user.puntos} puntos)
                    </option>
                ))}
            </select>

            <label>Nuevos puntos:</label>
            <input
                type="number"
                value={state.newPoints}
                onChange={(e) =>
                    setState((prev) => ({ ...prev, newPoints: e.target.value }))
                }
            />

            <button onClick={handleUpdatePoints}>Actualizar Puntos</button>

            {state.message.text && (
                <p className={`message ${state.message.type}`}>
                    {state.message.text}
                </p>
            )}
        </div>
    );
};