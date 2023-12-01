import React, { useState, useEffect } from "react";
import axios from "axios";

const CrearUsuario = () => {
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [rolSelect, setRolSelect] = useState(0);
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidop, setApellidop] = useState("");
  const [apellidom, setApellidom] = useState("");
  const [password, setPassword] = useState("");

  const traerRoles = () => {
    axios.get("http://127.0.0.1:8000/traer_rol/").then((res) => {
      setRoles(res.data.data);
    });
  };

  useEffect(() => {
    traerRoles();
  }, []);

  const cambiarValores = (e) => {
    const { name, value } = e.target;
    if (name == "rolSelect") {
      setRolSelect(value);
    } else if (name == "rut") {
      setRut(value);
    } else if (name == "nombre") {
      setNombre(value);
    } else if (name == "apellidop") {
      setApellidop(value);
    } else if (name == "apellidom") {
      setApellidom(value);
    } else if (name == "password") {
      setPassword(value);
    }
  };

  const validaciones = () => {
    let validacion = true;
    if (rolSelect == 0) {
      validacion = false;
    }
    if (rut == "") {
      validacion = false;
    }
    if (nombre == "") {
      validacion = false;
    }
    if (apellidop == "") {
      validacion = false;
    }
    if (apellidom == "") {
      validacion = false;
    }
    if (password == "") {
      validacion = false;
    }
    return validacion;
  };

  const crearusuario = () => {
    if (validaciones()) {
      axios
        .post("http://127.0.0.1:8000/crear_usuario/", {
          usu_nombre: nombre,
          usu_apellido_p: apellidop,
          usu_apellido_m: apellidom,
          usu_rut: rut,
          usu_password: password,
          usu_rol: rolSelect,
          usu_estado:1,
        })
        .then((res) => {
          if (res.data.estado) {
            alert("Usuario creado con exito");
            setRolSelect("");
            setRut("");
            setNombre("");
            setApellidop("");
            setApellidom("");
            setPassword("");
          }
        });
    } else{
      alert("Debe completar todos los campos obligatoriamente")
    }
  };

  return (
    <>
      <div style={{ width: "80%", height: "100%", margin:"auto" }}>
        <div>
          <input
          className="input_administrador"
            style={{ width: "22%", marginRight: "1%" }}
            type="text"
            placeholder="Nombre"
            value={nombre}
            name="nombre"
            onChange={cambiarValores}
          />
          <input
          className="input_administrador"
            style={{ width: "22%", marginRight: "1%" }}
            type="text"
            name="apellidop"
            placeholder="apellido paterno"
            value={apellidop}
            onChange={cambiarValores}
          />
          <input
          className="input_administrador"
            style={{ width: "22%", marginRight: "1%" }}
            type="text"
            name="apellidom"
            placeholder="apellido materno"
            value={apellidom}
            onChange={cambiarValores}
          />
          <input
          className="input_administrador"
            style={{ width: "22%", marginRight: "1%" }}
            type="text"
            value={rut}
            name="rut"
            placeholder="RUT"
            onChange={cambiarValores}
          />
        </div>
        <div style={{ marginTop: "2%" }}>
          <input
          className="input_administrador"
            style={{ width: "22%", marginRight: "1%" }}
            type="password"
            placeholder="Contraseña"
            value={password}
            name="password"
            onChange={cambiarValores}
          />
          <select
          className="input_administrador"
            style={{ width: "22%" }}
            value={rolSelect}
            onChange={cambiarValores}
            name="rolSelect"
          >
            <option value={0} disabled>
              Seleccione un rol
            </option>

            {roles.map((rol, index) => {
              return (
                <option key={rol.rol_id} value={rol.rol_id}>
                  {rol.rol_nombre}
                </option>
              );
            })}
          </select>
        </div>
        <div
          style={{
            marginTop: "2%",
            display: "flex",
            justifyContent: "flex-end",
            width: "91%",
          }}
        >
          <button 
        className="botonAdministrador-seleccionado"
        onClick={crearusuario} style={{ cursor: "pointer" }}>
            Guardar
          </button>
        </div>
      </div>
    </>
  );
};

export default CrearUsuario;
