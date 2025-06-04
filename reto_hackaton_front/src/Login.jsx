import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
  e.preventDefault();
  fetch("http://127.0.0.1:8000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.access) {
        onLogin(data.access, username);
      } else {
        setError("Credenciales inválidas");
      }
    });
};


  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Entrar</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
