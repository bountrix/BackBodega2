import React, { useState, useEffect } from "react";
import axios from "axios";

const ListaProductos = () => {
    const [error, setError] = useState("");
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const TraerProductos = () => {
        axios
          .get("http://127.0.0.1:8000/Traer_ProductosDes/")
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

      const cambiarEstadoProducto = (productoId) => {
        axios
          .post(`http://127.0.0.1:8000/Cambiar_Estado_Producto/${productoId}`)
          .then((res) => {
            setProductos((prevProductos) =>
              prevProductos.map((producto) =>
                producto.id === productoId
                  ? { ...producto, nuevoEstado: res.data.nuevoEstado }
                  : producto
              )
            );
            TraerProductos();
          })
          .catch((error) => {
            console.error("Error al enviar la solicitud post:", error);
          });
      };
    
      useEffect(() => {
        TraerProductos();
      }, []);
      return (
        <div>
            <table className="miTabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Accion</th>
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
                  <button onClick={() => {cambiarEstadoProducto(producto.pro_id);TraerProductos()}}>
                    Cambiar estado
                  </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
      )
}
export default ListaProductos;