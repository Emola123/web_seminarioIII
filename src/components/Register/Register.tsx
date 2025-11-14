import { useState } from "react";
import "./Register.css";

export default function Register({ onSubmit }: any) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("comprador");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit({ nombre, correo, contrasena, rol });
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Registro</h2>

        <div className="input-group">
          <label>Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

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

        <div className="input-group">
          <label>Rol</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="comprador">Comprador</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>

        <button className="btn-register">Crear cuenta</button>
      </form>
    </div>
  );
}
