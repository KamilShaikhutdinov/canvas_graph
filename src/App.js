import CanvasJSReact from "./canvasjs.react";
import React, { useState } from "react";
import Table from "./components/Table/Table";
import "./App.css";

function App() {
  const [graphData, setGraphData] = useState();
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options = {
    animationEnabled: true,
    title: {
      text: "Rustik's data",
    },
    axisY: {
      title: "some Y values",
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "spline",
        name: graphData ? Object.values(graphData[0])[1] : "",
        showInLegend: true,
        dataPoints: [
          { y: 155, label: "Jan" },
          { y: 150, label: "Feb" },
          { y: 152, label: "Mar" },
          { y: 148, label: "Apr" },
          { y: 142, label: "May" },
          { y: 150, label: "Jun" },
          { y: 146, label: "Jul" },
          { y: 149, label: "Aug" },
          { y: 153, label: "Sept" },
          { y: 158, label: "Oct" },
          { y: 154, label: "Nov" },
          { y: 150, label: "Dec" },
        ],
      },
      {
        type: "spline",
        name: graphData ? Object.values(graphData[5])[1] : "",
        showInLegend: true,
        dataPoints: [
          { y: 172, label: "Jan" },
          { y: 173, label: "Feb" },
          { y: 175, label: "Mar" },
          { y: 172, label: "Apr" },
          { y: 162, label: "May" },
          { y: 165, label: "Jun" },
          { y: 172, label: "Jul" },
          { y: 168, label: "Aug" },
          { y: 175, label: "Sept" },
          { y: 170, label: "Oct" },
          { y: 165, label: "Nov" },
          { y: 169, label: "Dec" },
        ],
      },
    ],
  };
  // const handleDraw = () => {
  //   setGraphData(graphData);
  // };
  return (
    <div className="App">
      {graphData && (
        <div className="canvas">
          <CanvasJSChart
            options={options}
            containerProps={{ width: "100%", height: "500px" }}
          />
        </div>
      )}
      <div>
        <Table setGraphData={setGraphData} />
      </div>
    </div>
  );
}

export default App;
