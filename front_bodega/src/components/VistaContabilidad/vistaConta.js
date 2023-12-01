import React, { useState, useEffect } from "react";
import axios from "axios";
import GraficoA from "../../graficos/graficoprincipal";
import GraficoB from "../../graficos/graficoprincipal1";
import { useNavigate } from "react-router-dom";
const VistaContabilidad = () => {
  const [graficoSeleccionado, setGraficoSeleccionado] = useState("GraficoA");
  const navigate = useNavigate();
  const mostrarGrafico = (nombre) => {
    setGraficoSeleccionado(nombre);
  };

  const handleCerrarSesion = () => {
    navigate("/");
  };

  return (
    <div className="div-contabilidad">
      <div style={{display:"flex",flexDirection:"row-reverse"}}>
        <button className="boton-cerrar-sesion" onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
        </div>
      <div>
        {graficoSeleccionado === "GraficoA" && <GraficoA />}
      </div>
    </div>
  );
};

export default VistaContabilidad;
