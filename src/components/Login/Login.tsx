import React, { useState } from "react";
import "./Login.css";

export default function Login({ onSubmit }: any) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit({ correo, contrasena });
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <div className="input-group">
          <label>Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <button className="btn-login" type="submit">
          Entrar
        </button>

        <span className="forgot">¿Olvidó su contraseña?</span>
        <span className="register-link" onClick={() => window.location.href = "/register"}>
        ¿No tiene cuenta? Regístrese
        </span>



      </form>
    </div>
  );
}
