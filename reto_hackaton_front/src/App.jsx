import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import NuevaSolicitud from "./NuevaSolicitud";
import Solicitudes from "./Solicitudes";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [solicitudes, setSolicitudes] = useState([]);
  const [usuario, setUsuario] = useState(""); // Puedes guardar el username aquí




  
  // Fetch de solicitudes (ejemplo con fetch y token)
  const cargarSolicitudes = () => {
    console.log("TOKEN ENVIADO:", token);
    fetch("http://127.0.0.1:8000/api/solicitudes/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => setSolicitudes(data))
      .catch(() => setSolicitudes([]));
  };

  useEffect(() => {
    if (token) cargarSolicitudes();
  }, [token]);

  const handleLogin = (tk, user) => {
    setToken(tk);
    setUsuario(user);
    localStorage.setItem("token", tk);
    cargarSolicitudes();
  };

  const handleLogout = () => {
    setToken("");
    setUsuario("");
    localStorage.removeItem("token");
  };

  // Crear nueva solicitud y recargar
  const onNuevaSolicitud = () => cargarSolicitudes();

  return (
    <div className="app-bg">
      {!token ? (
        <div className="caja modulo-1">
          <Login onLogin={handleLogin} />
        </div>
      ) : (
        <div className="dashboard">
          <div className="header">
            <h1>Solicitudes Hackaton</h1>
            <button className="cerrar-btn" onClick={handleLogout}>Cerrar sesión</button>
          </div>
          <div className="contenedores">
            <div className="caja modulo-2">
              <NuevaSolicitud token={token} onNueva={onNuevaSolicitud} usuario={usuario} />
            </div>
            <div className="caja modulo-3">
              <Solicitudes solicitudes={solicitudes} token={token} recargar={cargarSolicitudes} usuario={usuario} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
