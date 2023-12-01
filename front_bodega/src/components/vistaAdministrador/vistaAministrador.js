import React, { useState, useEffect } from "react";
import axios from "axios";
import CrearUsuario from "./crearUsuario";
import ListaUsuarios from "./listaDeUsuarios";
import ListaProveedores from "./listaProveedores";
import ListaProductos from "./listaProductos";

import { useNavigate } from "react-router-dom";
const VistaAministrador = () => {
  const [error, setError] = useState("");
  const [accionAdmin, setAccionAdmin] = useState(1);
  const navigate = useNavigate();
  const cambiarVista = (vista) =>{
    setAccionAdmin(vista)
  }

  const handleCerrarSesion = () => {
    navigate("/");
  };

  return (
    <>
     <div style={{display:"flex",flexDirection:"row-reverse"}}>
      <button className="boton-cerrar-sesion" onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
        </div>
      <div className="top" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <label
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'block',
          fontFamily: 'cursive',
          color: 'white',
          padding: '10px',
          background: "#999999",
          borderRadius: '5px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          width:"80%"
        }}
      >
        Panel Administrador
      </label>
      </div>
    <div style={{width: '100%',
    height: '100%',
    marginBottom: '5%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '5%'}}>
      <button className={accionAdmin == 1 ? "botonAdministrador-seleccionado":"botonAdministrador-seleccionable"} onClick={()=>cambiarVista(1)}>Crear Usuarios</button>
      <button className={accionAdmin == 2 ? "botonAdministrador-seleccionado":"botonAdministrador-seleccionable"} onClick={()=>cambiarVista(2)}>Lista de Usuarios</button>
      <button className={accionAdmin == 3 ? "botonAdministrador-seleccionado":"botonAdministrador-seleccionable"} onClick={()=>cambiarVista(3)}>Lista de proveedores</button>
      <button className={accionAdmin == 4 ? "botonAdministrador-seleccionado":"botonAdministrador-seleccionable"} onClick={()=>cambiarVista(4)}>Productos Deshabilitados</button>
    </div>
    <div style={{width:'100%', height:'100%' }}>
      {accionAdmin == 1 ?(
        <CrearUsuario/>
      ): accionAdmin == 2 ?(
        <ListaUsuarios/>
      ): accionAdmin == 3 ?(
        <ListaProveedores/>
      ): accionAdmin == 4 ?(
        <ListaProductos/>)
        :null}
    </div>
    </>
  );
};

export default VistaAministrador;
