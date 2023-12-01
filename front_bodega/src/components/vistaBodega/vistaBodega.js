import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const VistaBodega = () => {
  const [error, setError] = useState("");
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modificarVisible, setModificarVisible] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [modificarProducto, setModificarProducto] = useState({
    pro_nombre: "",
    pro_marca: "",
    pro_stock: 0,
    pro_precio: 0,
    pro_estado:1,
  });
  const [agregarVisible, setAgregarVisible] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    pro_nombre: "",
    pro_stock: "",
    pro_marca: "",
    pro_fecha_vencimiento: "",
    pro_precio: "",
    pro_descripcion: "",
    pro_proveedore: "",
    pro_estado:1,
  });
  const [marcas, setMarcas] = useState([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(0);
  const [provedorees, setProvedorees] = useState([]);
  const [proSeleccionado, setProSeleccionada] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [agregarMarca, setAgregarMarca] = useState(false);
  const [nuevaMarca, setNuevaMarca] = useState({
    mar_nombre: "",
  });
  const [agregarProv, setAgregarProv] = useState(false);
  const [nuevoProv, setNuevoProv] = useState({
    prov_nombre: "",
    prov_contacto: "",
    prov_telefono: "",
    prov_correo: "",
  });
  const TraerProductos = () => {
    axios
      .get("http://127.0.0.1:8000/Traer_Productos/")
      .then((res) => {
        if (!res.data.estado) {
          setError(res.data.mensaje);
        } else {
          setProductos(
            res.data.data.map((producto) => ({
              ...producto,
              cantidadDescontar: 0,
              cantidadAgregar: 0,
            }))
          );
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud get:", error);
      });
  };

  

  const TraerMarcas = () => {
    axios.get("http://127.0.0.1:8000/Obtener_Marcas/").then((res) => {
      if (res.data.estado) {
        setMarcas(res.data.marcas);
      } else {
        setError(res.data.mensaje);
      }
    });
  };

  const TraerProveedores = () => {
    axios.get("http://127.0.0.1:8000/Obtener_Proveedores/").then((res) => {
      if (res.data.estado) {
        setProvedorees(res.data.proveedores);
        console.log(res.data.proveedores);
      } else {
        setError(res.data.mensaje);
      }
    });
  };

  useEffect(() => {
    TraerProductos();
    TraerMarcas();
    TraerProveedores();
    console.log("ID del usuario:", userId);
  }, [userId]);

  const handleDescontar = (producto) => {
    axios
      .post("http://127.0.0.1:8000/Descontar_Producto/", {
        producto_id: producto.pro_id,
        cantidad_a_descontar: producto.cantidadDescontar,
        usu_id: userId,
      })
      .then((res) => {
        if (res.data.estado) {
          TraerProductos();
        } else {
          alert(res.data.mensaje);
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud para descontar:", error);
      });
  };

  const handleAgregar = (producto) => {
    axios
      .post("http://127.0.0.1:8000/Agregar_Stock/", {
        producto_id: producto.pro_id,
        cantidad_a_agregar: producto.cantidadAgregar,
        usu_id: userId,
      })
      .then((res) => {
        if (res.data.estado) {
          TraerProductos();
        } else {
          setError(res.data.mensaje);
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud para agregar:", error);
      });
  };

  const handleModificar = (producto) => {
    const marcaSeleccionada = marcas.find((marca) => marca.mar_nombre === producto.pro_marca__mar_nombre)
    console.log(marcaSeleccionada);
    setModificarProducto({
      pro_nombre: producto.pro_nombre,
      pro_marca: marcaSeleccionada["mar_id"],
      pro_stock: producto.pro_stock,
      pro_precio: producto.pro_precio,
      pro_estado: producto.estado,
    });
    TraerProductos()
    setProductoSeleccionado(producto);
    setModificarVisible(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/Modificar_Producto/", {
        producto_id: productoSeleccionado.pro_id,
        nuevo_nombre: modificarProducto.pro_nombre,
        nueva_marca: modificarProducto.pro_marca,
        nuevo_stock: modificarProducto.pro_stock,
        nuevo_precio: modificarProducto.pro_precio,
        nuevo_estado: modificarProducto.pro_estado,
        usu_id: userId,
      })
      .then((res) => {
        if (res.data.estado) {
          TraerProductos();
          setModificarVisible(false);
          setProductoSeleccionado(null);
        } else {
          setError(res.data.mensaje);
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud para modificar:", error);
      });
  };

  const toggleAgregarContainer = () => {
    setAgregarVisible(!agregarVisible);
  };

  const toggleAgregarContainer2 = () => {
    setAgregarMarca(!agregarMarca);
  };

  const toggleAgregarContainer3 = () => {
    setAgregarProv(!agregarProv);
  };

  const handleAgregarProducto = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/Agregar_Producto/", {
        pro_nombre: nuevoProducto.pro_nombre,
        pro_stock: nuevoProducto.pro_stock,
        pro_marca: marcaSeleccionada,
        pro_fecha_vencimiento: nuevoProducto.pro_fecha_vencimiento,
        pro_precio: nuevoProducto.pro_precio,
        pro_descripcion: nuevoProducto.pro_descripcion,
        pro_proveedore: proSeleccionado,
        pro_estado:1,
        usu_id: userId,
      })
      .then((res) => {
        if (res.data.estado) {
          TraerProductos();
          setAgregarVisible(false);
        } else {
          console.error("Error al agregar producto:", res.data.mensaje);
        }
      })
      .catch((error) => {
        console.error(
          "Error al enviar la solicitud para agregar producto:",
          error
        );
      });
  };

  const handleAgregarMarca = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/Agregar_Marca/", {
        mar_nombre: nuevaMarca.mar_nombre,
      })
      .then((res) => {
        if (res.data.estado) {
          TraerMarcas();
          setAgregarMarca(false);
        } else {
          console.error("Error al agregar Marca:", res.data.mensaje);
        }
      })
      .catch((error) => {
        console.error(
          "Error al enviar la solicitud para agregar Marca:",
          error
        );
      });
  };

  const handleAgregarProv = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/Agregar_Proveedor/", {
        prov_nombre: nuevoProv.prov_nombre,
        prov_contacto: nuevoProv.prov_contacto,
        prov_telefono: nuevoProv.prov_telefono,
        prov_correo: nuevoProv.prov_correo,
      })
      .then((res) => {
        if (res.data.estado) {
          TraerProveedores();
          setAgregarProv(false);

        } else {
          console.error("Error al agregar Marca:", res.data.mensaje);
        }
      })
      .catch((error) => {
        console.error(
          "Error al enviar la solicitud para agregar Marca:",
          error
        );
      });
  };
  const handleCerrarSesion = () => {
    navigate("/");
  };

  return (
    <div className="div-bodega">
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
        Productos en Bodega
      </label>
      </div>
      <div className="mid">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
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
              }}
            />
            <button
              onClick={toggleAgregarContainer}
              style={{
                padding: '10px 15px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Agregar Producto
            </button>
        </div>
        <table className="miTabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Cantidad a Descontar</th>
              <th>Cantidad a Agregar</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos
              .filter(
                (producto) =>
                  !searchTerm ||
                  (producto.pro_nombre &&
                    producto.pro_nombre
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()))
              )
              .map((producto, index) => (
                <tr key={index}>
                  <td>{producto.pro_nombre}</td>
                  <td>{producto.pro_marca__mar_nombre}</td>
                  <td>{producto.pro_stock}</td>
                  <td>{producto.pro_precio}</td>
                  <td>
                    <input
                      type="number"
                      value={producto.cantidadDescontar}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        if (!isNaN(newValue)) {
                          const updatedProductos = [...productos];
                          updatedProductos[index].cantidadDescontar = newValue;
                          setProductos(updatedProductos);
                        }
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={producto.cantidadAgregar}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        if (!isNaN(newValue)) {
                          const updatedProductos = [...productos];
                          updatedProductos[index].cantidadAgregar = newValue;
                          setProductos(updatedProductos);
                        }
                      }}
                    />
                  </td>
                  <td>
                    <div className="botones">
                      <button onClick={() => {handleModificar(producto);TraerProductos()}}>
                        Modificar
                      </button>
                      <button onClick={() => handleDescontar(producto)}>
                        Descontar
                      </button>
                      <button onClick={() => handleAgregar(producto)}>
                        Agregar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="bot">
        <label>{error}</label>
      </div>
      {modificarVisible && productoSeleccionado && (
        <div className="modal-container">
          <div className="modal-content">
            <h3>Modificar Producto</h3>
            <form onSubmit={handleSubmit}>
              <label>Nombre:</label>
              <input
                type="text"
                value={modificarProducto.pro_nombre}
                onChange={(e) =>
                  setModificarProducto({
                    ...modificarProducto,
                    pro_nombre: e.target.value,
                  })
                }
              />
              <label>Marca:</label>
              <select
                  value={modificarProducto.pro_marca}
                  onChange={(e) =>
                  setModificarProducto({
                      ...modificarProducto,
                      pro_marca: e.target.value,
                    })
                  }
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    marginRight: '10px',
                    flex: '1',
                    width:"90%"
                  }}
                >
                  <option value=""> Selecciona una marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.mar_id} value={marca.mar_id}>
                      {marca.mar_nombre}
                    </option>
                  ))}
                </select> 
              <label>Stock:</label>
              <input
                type="number"
                value={modificarProducto.pro_stock}
                onChange={(e) =>
                  setModificarProducto({
                    ...modificarProducto,
                    pro_stock: parseInt(e.target.value, 10),
                  })
                }
              />
              <label>Precio:</label>
              <input
                type="number"
                value={modificarProducto.pro_precio}
                onChange={(e) =>
                  setModificarProducto({
                    ...modificarProducto,
                    pro_precio: parseFloat(e.target.value),
                  })
                }
                
              />
              <label>Estado:</label>
              <select
                  value={modificarProducto.pro_estado}
                  onChange={(e) =>
                  setModificarProducto({
                      ...modificarProducto,
                      pro_estado: e.target.value,
                    })
                  }
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    marginRight: '10px',
                    flex: '1',
                    width:"90%"
                  }}
                >
                  <option  value="">
                      Cambiar Estado
                  </option>
                  <option  value="0">
                      Deshabilitar
                  </option>
                  <option  value="1">
                      Habilitar
                  </option>
                </select>




              <button type="submit">Guardar Cambios</button>
              <button onClick={() => setModificarVisible(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
      {agregarVisible && (
        <div className="transparent-background">
          <div className="modal-content" >
            <h3>Agregar Producto</h3>
            <form onSubmit={handleAgregarProducto} style={{display:"flex",flexDirection:"column",alignItems:"stretch"}}>
              <label>Nombre:</label>
              <input
                type="text"
                value={nuevoProducto.pro_nombre}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    pro_nombre: e.target.value,
                  })
                }
              />
              <label>Stock:</label>
              <input
                type="number"
                value={nuevoProducto.pro_stock}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    pro_stock: parseInt(e.target.value, 10),
                  })
                }
              />
              <label>Marca:</label>
              <div style={{display:"flex",justifyContent:"center"}}>
                <select
                  value={marcaSeleccionada}
                  onChange={(e) => setMarcaSeleccionada(e.target.value)}
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    marginRight: '10px',
                    flex: '1',
                    width:"80%"
                  }}
                >
                  <option value="">Selecciona una marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.mar_id} value={marca.mar_id}>
                      {marca.mar_nombre}
                    </option>
                  ))}
                </select> 
                <button onClick={toggleAgregarContainer2}style={{width:"55px",height:"30px",fontSize:"9px",padding:"0",background:"green",margin:"0",marginLeft:"10px"}}>Agregar Marca</button>
              </div>
              <label>Fecha de Vencimiento:</label>
              <input
                type="date"
                value={nuevoProducto.pro_fecha_vencimiento}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    pro_fecha_vencimiento: e.target.value,
                  })
                }
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  marginRight: '10px',
                  flex: '1',
                  width:"90%"
                }}
              />
              <label>Precio:</label>
              <input
                type="number"
                value={nuevoProducto.pro_precio}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    pro_precio: parseInt(e.target.value, 10),
                  })
                }
              />
              <label>Descripción:</label>
              <textarea
                value={nuevoProducto.pro_descripcion}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    pro_descripcion: e.target.value,
                  })
                }
              />
              <label>Proveedor:</label>
              <div style={{display:"flex",justifyContent:"center",marginBottom:"5%"}}>
              <select
                value={proSeleccionado}
                onChange={(e) => setProSeleccionada(e.target.value)}
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  marginRight: '10px',
                  flex: '1',
                  width:"80%"
                }}
              >
                <option value="">Selecciona una marca</option>
                {provedorees.map((provedor) => (
                  <option key={provedor.prov_id} value={provedor.prov_id}>
                    {provedor.prov_nombre} {provedor.prov_contacto}
                  </option>
                ))}
              </select>
              <button onClick={toggleAgregarContainer3} style={{width:"55px",height:"30px",fontSize:"9px",padding:"0",background:"green",margin:"0",marginLeft:"10px"}}>Agregar Proveedor</button>
              </div>
              <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
              <button type="submit">Agregar Producto</button>
              <button onClick={toggleAgregarContainer}>Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {agregarMarca && (
        <div className="transparent-background">
        <div className="modal-content" >
          <h3>Agregar Marca</h3>
          <form onSubmit={handleAgregarMarca} style={{display:"flex",flexDirection:"column",alignItems:"stretch"}}>
            <label>Ingrese la marca nueva</label>
            <input
                type="text"
                value={agregarMarca.mar_nombre}
                onChange={(e) =>
                  setNuevaMarca({
                    ...nuevaMarca,
                    mar_nombre: e.target.value,
                  })
                }
                style={{marginBottom:"5%"}}
              />
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
            <button type="submit" >Agregar Marca</button>
            <button onClick={toggleAgregarContainer2}>Cerrar</button>
          </div>
          </form>
          
        </div>
        </div>
      )}
      {agregarProv && (
        <div className="transparent-background">
        <div className="modal-content">
          <h3>Agregar Proveedor</h3>
          <form onSubmit={handleAgregarProv} style={{display:"flex",flexDirection:"column",alignItems:"stretch"}}>
            <label>Ingrese Nombre del Proveedor</label>
            <input
                type="text"
                value={nuevoProv.prov_nombre}
                onChange={(e) =>
                  setNuevoProv({
                    ...nuevoProv,
                    prov_nombre: e.target.value,
                  })
                }
                style={{marginBottom:"5%"}}
              />
              <label>Ingrese Nombre del Contacto </label>
            <input
                type="text"
                value={nuevoProv.prov_contacto}
                onChange={(e) =>
                  setNuevoProv({
                    ...nuevoProv,
                    prov_contacto: e.target.value,
                  })
                }
                style={{marginBottom:"5%"}}
              />
              <label>Ingrese Telefono</label>
            <input
                type="number"
                
                value={nuevoProv.prov_telefono}
                onChange={(e) =>
                  setNuevoProv({
                    ...nuevoProv,
                    prov_telefono: e.target.value,
                  })
                }
                style={{marginBottom:"5%"}}
              />
              <label>Ingrese Correo</label>
            <input
                type="text"
                value={nuevoProv.prov_correo}
                onChange={(e) =>
                  setNuevoProv({
                    ...nuevoProv,
                    prov_correo: e.target.value,
                  })
                }
                style={{marginBottom:"5%"}}
              />
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
            <button type="submit" >Agregar Proveedor</button>
            <button onClick={toggleAgregarContainer3}>Cerrar</button>
          </div>
          </form>
          
        </div>
        </div>
      )}
    </div>
  );
};

export default VistaBodega;
