import React, { useState, useEffect } from "react";
import axios from "axios";

const ListaProveedores = () => {
  const [proveedores, setProveedores] = useState([]);


  const traerUsuarios = () => {
    axios.get("http://127.0.0.1:8000/Traer_proveedores_lista/").then((res) => {
        setProveedores(res.data.data);
    });
  };

  useEffect(() => {
    traerUsuarios();
  }, []);

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <table className="miTabla">
          <thead style={{marginBottom:"2%"}}>
            <tr>
              <th style={{width: '22%',textAlign: 'start'}}>Nombre</th>
              <th style={{width: '22%',textAlign: 'start'}}>Contacto</th>
              <th style={{width: '22%',textAlign: 'start'}}>Telefono</th>
              <th style={{width: '22%',textAlign: 'start'}}>Email</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((pro) => (
              <tr style={{marginBottom:"2%"}} key={pro.prov_id}>
                <td style={{width: '22%',textAlign: 'start'}}>{pro.prov_nombre}</td>
                <td style={{width: '22%',textAlign: 'start'}}>{pro.prov_contacto}</td>
                <td style={{width: '22%',textAlign: 'start'}}>{pro.prov_telefono}</td>
                <td style={{width: '22%',textAlign: 'start'}}>{pro.prov_correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListaProveedores;
