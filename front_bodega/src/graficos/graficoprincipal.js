import React, { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from "axios";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
const GraficoTotales = () => {
  const [data1, setData1] = useState([]);

  const TraerData = () => {
    axios
      .get("http://127.0.0.1:8000/traer_grafico/")
      .then((res) => {
        if (res.data.estado) {
          setData1(res.data.data);
        } else {
          console.log("salio mal");
        }
      });
  };

  useEffect(() => {
    TraerData();
  }, []);

  useEffect(() => {
    const root = am5.Root.new("chartdiv");
    console.log(data1);
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      layout: root.verticalLayout
    }));
    
    
    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
      })
    );
    
    let data = data1
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9
    })
    
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "fecha",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    
    xRenderer.grid.template.setAll({
      location: 1
    })
    
    xAxis.data.setAll(data);
    
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));
    
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name, fieldName) {
      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "fecha"
      }));
    
      series.columns.template.setAll({
        tooltipText: "{name}: {valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0
      });
    
      series.data.setAll(data);
    
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();
    
      series.bullets.push(function() {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true
          })
        });
      });
    
      legend.data.push(series);
    }

    makeSeries("Producto Ingresado", "Producto Ingresado");
    makeSeries("Producto descontado", "Producto descontado");
    makeSeries("Producto agregado", "Producto agregado");
    
    
    let exporting = am5plugins_exporting.Exporting.new(root, {
      menu: am5plugins_exporting.ExportingMenu.new(root, {}),
      dataSource: data,
      filePrefix: "myChart"
    });
    
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
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
          color: 'white',
          padding: '10px',
          background: "#999999",
          borderRadius: '5px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          width:"80%"
        }}>Grafico de la informacion de productos</h1>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default GraficoTotales;
