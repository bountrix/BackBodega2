import React, { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from "axios";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
const GraficoTotales1 = () => {
  const [data1, setData1] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const TraerData = () => {
    axios
      .get("http://127.0.0.1:8000/producto_provedor/",{params:{
        producto:productoSeleccionado
      }})
      .then((res) => {
        if (res.data.estado) {
          setData1(res.data.data);
        } else {
          console.log("salio mal");
          alert(res.data.mensaje)
        }
      });
  };

  const TraerProductos = () => {
    axios
      .get("http://127.0.0.1:8000/Traer_pro_historial/")
      .then((res) => {
        if (res.data.estado) {
          setProductos(res.data.data);
        } else {
          console.log("salio mal");
          
        }
      });
  };

  const handleChange = (event) => {
    console.log(event.target.value);
     setProductoSeleccionado(event.target.value)
  };


  useEffect(() => {
    TraerData();
    TraerProductos();
  }, []);
  
  useEffect(() => {
    TraerData();
  }, [productoSeleccionado]);

  useEffect(() => {

    let root = am5.Root.new("chartdiv2");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
 
    let chart = root.container.children.push(am5xy.XYChart.new(root, {

      pinchZoomX: true,
      paddingLeft:0,
      paddingRight:1
    }));
    

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);
    
    
  
    let xRenderer = am5xy.AxisRendererX.new(root, { 
      minGridDistance: 30, 
      minorGridEnabled: true
    });
    
    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });
    
    xRenderer.grid.template.setAll({
      location: 1
    })
    
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "producto",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    let yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
    })
    
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: yRenderer
    }));
    

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "Stock",
      sequencedInterpolation: true,
      categoryXField: "producto",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));
    
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    
    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });
    
    console.log(data1);
    let data = data1;

    let exporting = am5plugins_exporting.Exporting.new(root, {
      menu: am5plugins_exporting.ExportingMenu.new(root, {}),
      dataSource: data,
      filePrefix: "Productos Descontados",
      pdfOptions:{
        addURL:false,
        includeData:true
      }
    });
    
    xAxis.data.setAll(data);
    series.data.setAll(data);

    
    
    
    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data1]);

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
     <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'block',
          fontFamily: 'cursive',
          color: 'Black',
          background:"white",
          borderRadius: '5px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          width:"80%"
        }}>Ingreso de productos por proveedor</h1>
        <select onChange={handleChange} value={productoSeleccionado}>
        <option value="" disabled>
          Selecciona un producto
        </option>
        {productos.map((producto) => (
          <option key={producto.id} value={producto.id}>
            {producto.nombre}
          </option>
        ))}
      </select>
      <div id="chartdiv2" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default GraficoTotales1;
