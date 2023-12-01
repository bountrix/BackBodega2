import React, { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from "axios";

const GraficoTotales1 = () => {
  const [data1, setData1] = useState([]);

  const TraerData = () => {
    axios
      .get("http://127.0.0.1:8000/obtener_historial_descuentan/")
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
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
      })
    );

    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15,
    });

    xRenderer.grid.template.setAll({
      location: 1,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "producto",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
      })
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "total",
        sequencedInterpolation: true,
        categoryXField: "producto",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
        }),
      })
    );

    series.columns.template.setAll({
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      strokeOpacity: 0,
    });
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    const data = data1;
    xAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data1]);

  return (
    <div>
      <h1>Grafico tontal de productos descontados</h1>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default GraficoTotales1;
