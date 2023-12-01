import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [rol, setRol] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "usuario") {
      setUsuario(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const validarUsuario = () => {
    axios
      .post("http://127.0.0.1:8000/Iniciar_sesion/", {
        rut: usuario,
        password: password,
      })
      .then((res) => {
        if (!res.data.estado) {
          console.error(res.data.mensaje);
          setError(res.data.mensaje);
        } else {
          setError("");
          localStorage.setItem("userId", res.data.id);

          if (res.data.rol === 3) {
            navigate("/VistaAdmin");
          } else if (res.data.rol === 2) {
            navigate("/VistaContabilidad");
          } else if (res.data.rol === 1) {
            navigate("/VistaBodega");
          }
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud POST:", error);
      });
  };

  return (
    <div class="centered-container">
      <div className="centered-div">
        <div className="div-Titulo">
          <h1>Iniciar Sesion</h1>
        </div>
        <div className="div-Input">
          <input
            type="text"
            name="usuario"
            placeholder="Ingrese Rut"
            value={usuario}
            onChange={handleInputChange}
          ></input>
          <input
            type="password"
            name="password"
            placeholder="Ingrese Contraseña"
            value={password}
            onChange={handleInputChange}
          ></input>
          <h3>{error}</h3>
          <button onClick={validarUsuario}>Iniciar Sesion</button>
        </div>
        <div className="div-back"></div>
      </div>
    </div>
  );
};

export default Login;
