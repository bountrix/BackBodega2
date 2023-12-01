import React, { useState, useEffect } from "react";
import axios from "axios";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [usuSeleccionado, setUsuSeleccionado] = useState(null);
  const [modificarVisible, setModificarVisible] = useState(false);
  const [modificarUsu, setModificarUsu] = useState({
    usu_id: "",
    usu_nombre: "",
    usu_apellido_p: "",
    usu_apellido_m: "",
    usu_rut:"",
    usu_rol:"",
    usu_estado:"",
  });

  const traerUsuarios = () => {
    axios.get("http://127.0.0.1:8000/Traer_usuarios_lista/").then((res) => {
      setUsuarios(res.data.data);
    });
  };
  const [roles, setRoles] = useState([]);
  const [rolSeleccionada, setRolSeleccionada] = useState(0);

  const handleModificar = (usu) => {
    setModificarUsu({
      usu_id: usu.usu_id,
      usu_nombre: usu.usu_nombre,
      usu_apellido_p: usu.usu_apellido_p,
      usu_apellido_m: usu.usu_apellido_m,
      usu_rut:usu.usu_rut,
      usu_rol:usu.usu_rol,
      usu_estado:usu.usu_estado
    });
    setUsuSeleccionado(usu);
    setModificarVisible(true);
  };

  const traerRoles = () => {
    axios.get("http://127.0.0.1:8000/traer_rol/").then((res) => {
      setRoles(res.data.data);
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(modificarUsu);
    if (modificarUsu.usu_rol == undefined){
      console.log(usuSeleccionado);
      for (let i = 0; i < roles.length; i++) {
        console.log(roles[i]["rol_nombre"])
        if (roles[i]["rol_nombre"] === usuSeleccionado.rol) {
          modificarUsu.usu_rol = roles[i]["rol_id"]
          break; 
        }
        else{
          console.log("no entra");
        }
      }
    }
    axios
      .post("http://127.0.0.1:8000/Modificar_Usuario/", {
        usu_id: usuSeleccionado.usu_id,
        nuevo_nombre: modificarUsu.usu_nombre,
        nueva_apellido_p: modificarUsu.usu_apellido_p,
        nueva_apellido_m: modificarUsu.usu_apellido_m,
        nuevo_rut: modificarUsu.usu_rut,
        nuevo_rol: modificarUsu.usu_rol,
        nuevo_estado: modificarUsu.usu_estado
      })
      .then((res) => {
        if (res.data.estado) {
          traerUsuarios();
          setModificarVisible(false);
          setUsuSeleccionado(null);
        } else {
          alert(res.data.mensaje);
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud para modificar usuario:", error);
      });
  };

  useEffect(() => {
    traerUsuarios();
    traerRoles();
  }, []);

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
      <input
              type="text"
              placeholder="Buscar producto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginRight: '10px',
                flex: '1',
                width:'90%',
                marginLeft:'5%'
              }}
            />
        <table className="miTabla">
          <thead style={{marginBottom:"2%"}}>
            <tr>
              <th style={{width: '22%',textAlign: 'start'}}>Nombre</th>
              <th style={{width: '22%',textAlign: 'start'}}>Apellido paterno</th>
              <th style={{width: '22%',textAlign: 'start'}}>Apellido materno</th>
              <th style={{width: '22%',textAlign: 'start'}}>RUT</th>
              <th style={{width: '22%',textAlign: 'start'}}>rol</th>
              <th style={{width: '22%',textAlign: 'start'}}>Editar</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.filter((usu)=>!searchTerm||(usu.usu_nombre && usu.usu_nombre.toLowerCase().includes(searchTerm.toLowerCase()))).map((usu) => (
              <tr style={{marginBottom:"2%"}} key={usu.usu_id}>
                <td style={{width: '22%',textAlign: 'start'}}>{usu.usu_nombre}</td>
                <td style={{width: '22%',textAlign: 'start'}}>{usu.usu_apellido_p}</td>
                <td style={{width: '22%',textAlign: 'start'}}>{usu.usu_apellido_m}</td>
                <td style={{width: '22%',textAlign: 'start'}}>{usu.usu_rut}</td>
                <td style={{width: '22%',textAlign: 'start'}}>{usu.rol}</td>
                <td  style={{width: '22%',textAlign: 'start'}}><button className='botonEditar' onClick={() => handleModificar(usu)}>Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modificarVisible && usuSeleccionado &&(
        <div className="transparent-background">
        <div className="modal-content">
          <h3>Agregar Usuario</h3>
          <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",alignItems:"stretch"}}>
            <label>Ingrese Nombre </label>
            <input
                type="text"
                value={modificarUsu.usu_nombre}
                onChange={(e) =>
                  setModificarUsu({
                    ...modificarUsu,
                    usu_nombre: e.target.value,
                  })
                }
                style={{marginBottom:"5%"}}
              />
              <label>Ingrese Apellido Paterno </label>
            <input
                type="text"
                value={modificarUsu.usu_apellido_p}
                onChange={(e) =>
                  setModificarUsu({
                    ...modificarUsu,
                    usu_apellido_p: e.target.value,
                  })
                }
                style={{marginBottom:"5%"}}
              />
              <label>Ingrese Apellido Materno</label>
            <input
                type="text"
                
                value={modificarUsu.usu_apellido_m}
                onChange={(e) =>
                  setModificarUsu({
                    ...modificarUsu,
                    usu_apellido_m: e.target.value,
                  })
                }
                style={{marginBottom:"5%"}}
              />
              <label>Ingrese Rol</label>
              <select
                  value={modificarUsu.usu_rol}
                  onChange={(e) =>
                    setModificarUsu({
                      ...modificarUsu,
                      usu_rol: e.target.value,
                    })
                  }
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    marginRight: '10px',
                    flex: '1',
                    width:"95%"
                  }}
                >
                  <option value=""> Selecciona una rol</option>
                  {roles.map((ro) => (
                    <option key={ro.rol_id} value={ro.rol_id}>
                      {ro.rol_nombre}
                    </option>
                  ))}
                </select> 
               <label>Ingrese Rut</label>
            <input
                type="text"
                value={modificarUsu.usu_rut}
                onChange={(e) =>
                  setModificarUsu({
                    ...modificarUsu,
                    usu_rut: e.target.value,
                  })
                }
                style={{marginBottom:"5%"}}
              />
            <select
                  value={modificarUsu.usu_rol}
                  onChange={(e) =>
                    setModificarUsu({
                      ...modificarUsu,
                      usu_estado: e.target.value,
                    })
                  }
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    marginRight: '10px',
                    flex: '1',
                    width:"95%"
                  }}
                >
                  <option value=""> Selecciona estado</option>
                  <option value='0'> Deshabilitar</option>
                  <option value='1'> Habilitar</option>
                </select>


            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
            <button type="submit" >Modificar</button>
            <button onClick={() =>setModificarVisible(false)}>Cerrar</button>
          </div>
          </form>
          
        </div>
        </div>
      )}
    </>
  );
};

export default ListaUsuarios;
