import { useRef, useState } from "react";
import axios from "axios";

export default function DetalleSolicitud({ solicitud, onClose }) {
  // Para subir archivo
  const [fileError, setFileError] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const fileInput = useRef();

  // Para crear proceso
  const [procesoNombre, setProcesoNombre] = useState("");
  const [procesoEstatus, setProcesoEstatus] = useState("Pendiente");
  const [procesoError, setProcesoError] = useState("");
  const [procesoLoading, setProcesoLoading] = useState(false);

  if (!solicitud) return null;

  // Función para subir un archivo
  const handleUpload = async (e) => {
    e.preventDefault();
    setFileError("");
    setFileLoading(true);
    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("solicitud", solicitud.id);
    formData.append("nombre", fileInput.current.files[0]?.name || "Archivo");
    formData.append("archivo", fileInput.current.files[0]);
    try {
      await axios.post("http://127.0.0.1:8000/api/archivos/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload(); // recarga para ver el archivo nuevo
    } catch (err) {
      setFileError("Error al subir archivo");
    } finally {
      setFileLoading(false);
    }
  };

  // Función para agregar un proceso (solo solicitudes aprobadas)
  const handleAgregarProceso = async (e) => {
    e.preventDefault();
    setProcesoError("");
    setProcesoLoading(true);
    try {
      const token = localStorage.getItem("access");
      await axios.post("http://127.0.0.1:8000/api/procesos/", {
        solicitud: solicitud.id,
        nombre: procesoNombre,
        estatus: procesoEstatus,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload(); // recarga para ver el proceso nuevo
    } catch (err) {
      setProcesoError("Error al agregar proceso");
    } finally {
      setProcesoLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 10
    }}>
      <div style={{ background: "#fff", padding: 24, borderRadius: 8, width: 500, maxWidth: "95%" }}>
        <h3>Detalle de Solicitud</h3>
        <b>Folio:</b> {solicitud.folio} <br />
        <b>Prioridad:</b> {solicitud.prioridad} <br />
        <b>Descripción:</b> {solicitud.descripcion} <br />
        <b>Estatus:</b> {solicitud.estatus} <br />
        <b>Responsable:</b> {solicitud.responsable_seguimiento} <br />
        <b>Fecha estimación:</b> {solicitud.fecha_estimacion} <br />
        <b>Retroalimentación:</b> {solicitud.retroalimentacion} <br />

        <hr />
        <b>Procesos:</b>
        <ul>
          {(solicitud.procesos?.length
            ? solicitud.procesos
            : []).map(proc => (
              <li key={proc.id}>{proc.nombre} – {proc.estatus}</li>
            ))}
          {(!solicitud.procesos || solicitud.procesos.length === 0) && <li>No hay procesos.</li>}
        </ul>

        {/* Formulario para agregar proceso */}
        {solicitud.estatus === "Aprobada" && (
          <form
            onSubmit={handleAgregarProceso}
            style={{ margin: "12px 0" }}
          >
            <input
              type="text"
              value={procesoNombre}
              onChange={e => setProcesoNombre(e.target.value)}
              placeholder="Nombre del proceso"
              required
              style={{ marginRight: 8, padding: 6 }}
            />
            <select
              value={procesoEstatus}
              onChange={e => setProcesoEstatus(e.target.value)}
              style={{ marginRight: 8, padding: 6 }}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Finalizado">Finalizado</option>
            </select>
            <button type="submit" disabled={procesoLoading}>
              {procesoLoading ? "Agregando..." : "Agregar proceso"}
            </button>
            {procesoError && <span style={{ color: "red", marginLeft: 8 }}>{procesoError}</span>}
          </form>
        )}

        <b>Archivos adjuntos:</b>
        <ul>
          {(solicitud.archivos?.length
            ? solicitud.archivos
            : []).map(file => (
              <li key={file.id}>
                <a
                  href={file.archivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  {file.nombre}
                </a>
              </li>
            ))}
          {(!solicitud.archivos || solicitud.archivos.length === 0) && <li>No hay archivos adjuntos.</li>}
        </ul>

        {/* Formulario para subir archivos */}
        <form onSubmit={handleUpload} style={{ margin: "16px 0" }}>
          <input type="file" ref={fileInput} required />
          <button type="submit" disabled={fileLoading}>
            {fileLoading ? "Subiendo..." : "Subir archivo"}
          </button>
          {fileError && <span style={{ color: "red", marginLeft: 8 }}>{fileError}</span>}
        </form>

        <button onClick={onClose} style={{ marginTop: 16 }}>Cerrar</button>
      </div>
    </div>
  );
}
