import React, { useState } from "react";

export default function Solicitudes({ solicitudes, token, recargar, usuario }) {
  const [filtro, setFiltro] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [estatus, setEstatus] = useState("");

  const aprobar = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/solicitudes/${id}/aprobar/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    recargar();
  };
  const rechazar = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/solicitudes/${id}/rechazar/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    recargar();
  };

  // Filtros
  const filtradas = solicitudes.filter(s => {
    return (
      (!filtro || s.folio?.toLowerCase().includes(filtro.toLowerCase()) || s.descripcion?.toLowerCase().includes(filtro.toLowerCase())) &&
      (!prioridad || s.prioridad === prioridad) &&
      (!estatus || s.estatus === estatus)
    );
  });

  return (
    <div className="solicitudes-listado">
      <h2>Solicitudes</h2>
      <div className="filtros">
        <input placeholder="Buscar por folio o descripción" value={filtro} onChange={e => setFiltro(e.target.value)} />
        <select value={prioridad} onChange={e => setPrioridad(e.target.value)}>
          <option value="">Todas prioridades</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <select value={estatus} onChange={e => setEstatus(e.target.value)}>
          <option value="">Todos los estatus</option>
          <option value="En revisión">En revisión</option>
          <option value="Aprobada">Aprobada</option>
          <option value="Rechazada">Rechazada</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Folio</th>
            <th>Prioridad</th>
            <th>Descripción</th>
            <th>Estatus</th>
            <th>Responsable</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.folio}</td>
              <td>{s.prioridad}</td>
              <td>{s.descripcion}</td>
              <td>{s.estatus}</td>
              <td>{s.responsable_seguimiento}</td>
              <td>
                {s.estatus === "En revisión" && (
                  <>
                    <button className="ap-btn" onClick={() => aprobar(s.id)}>Aprobar</button>
                    <button className="rej-btn" onClick={() => rechazar(s.id)}>Rechazar</button>
                  </>
                )}
                {(s.estatus === "Aprobada" || s.estatus === "Rechazada") && <span>-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
