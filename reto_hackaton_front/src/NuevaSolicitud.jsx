import React, { useState } from "react";

export default function NuevaSolicitud({ token, onNueva }) {
  const [descripcion, setDescripcion] = useState("");
  const [responsable, setResponsable] = useState("");
  const [tipoArea, setTipoArea] = useState("TI");
  const [fechaEstimacion, setFechaEstimacion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    const body = {
      descripcion,
      responsable_seguimiento: responsable,
      tipo_area: tipoArea,
      fecha_estimacion: fechaEstimacion,
      estatus: "En revisión",
    };
    const resp = await fetch("http://127.0.0.1:8000/api/solicitudes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (resp.ok) {
      setDescripcion("");
      setResponsable("");
      setTipoArea("TI");
      setFechaEstimacion("");
      setMensaje("¡Solicitud creada!");
      onNueva();
    } else {
      setMensaje("Error al crear solicitud.");
    }
  };

  return (
    <form className="formulario-nueva" onSubmit={handleSubmit}>
      <h2>Nueva Solicitud</h2>
      <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" required />
      <input value={responsable} onChange={e => setResponsable(e.target.value)} placeholder="Responsable seguimiento" required />
      <select value={tipoArea} onChange={e => setTipoArea(e.target.value)}>
        <option value="TI">TI</option>
        <option value="RH">RH</option>
        <option value="Finanzas">Finanzas</option>
      </select>
      <input type="datetime-local" value={fechaEstimacion} onChange={e => setFechaEstimacion(e.target.value)} required />
      <button type="submit">Guardar</button>
      {mensaje && <div className="mensaje">{mensaje}</div>}
    </form>
  );
}
