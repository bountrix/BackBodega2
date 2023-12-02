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
      <div style={{display:"flex",flexDirection:"row-reverse",justifyContent:"space-around",alignItems:"center"}}>
        <button className="boton-cerrar-sesion" onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'block',
          fontFamily: 'cursive',
          color: 'white',
          background: "#999999",
          borderRadius: '5px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          width:"80%"
        }}>Grafico de la informacion de productos</h1>
        </div>
        
      <div>
        <button className="boton-cerrar-sesion"  onClick={()=>{mostrarGrafico('GraficoA')}}>
          Grafico Salida de productos
        </button>
        <button className="boton-cerrar-sesion"  onClick={()=>{mostrarGrafico('GraficoB')}}>
          TOP productos sin stock
        </button>
      </div>
      <div>
        {graficoSeleccionado === "GraficoA" && <GraficoA />}
      </div>
    </div>
  );
};

export default VistaContabilidad;
