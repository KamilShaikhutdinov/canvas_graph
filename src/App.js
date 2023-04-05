import CanvasJSReact from "./canvasjs.react";
import React, { useState } from "react";
import Table from "./components/Table/Table";
import "./App.css";

function App() {
  const [graphData, setGraphData] = useState();
  const [filteredData, setFilteredData] = useState(graphData);
  const [chartData, setChartData] = useState();
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const handleTeamFilter = (team) => {
    const filtered = graphData.filter((item) => item["Team Name"] === team);
    setFilteredData(filtered);
  };

  const uniqueTeams = graphData
    ? [...new Set(graphData.map((item) => item["Team Name"]))]
    : [];

  const handleStoryPointsClick = () => {
    const uniqueAssignees = [
      ...new Set(filteredData.map((item) => item.Assignee)),
    ];
    const data = uniqueAssignees.map((assignee) => ({
      type: "spline",
      name: assignee,
      showInLegend: true,
      dataPoints: filteredData
        .filter((item) => item.Assignee === assignee)
        .map((item) => ({
          y: parseFloat(item["Story Points"]) || 0,
          label: item["Status Category Changed"] || 0,
        })),
    }));
    setChartData({
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
      data,
    });
  };
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
          { y: 155, label: "2/3/2022 20:03:35" },
          { y: 150, label: "2/17/2022 8:47:16" },
        ],
      },
      {
        type: "spline",
        name: graphData ? Object.values(graphData[5])[1] : "",
        showInLegend: true,
        dataPoints: [
          { y: 165, label: "3/3/2022 20:03:35" },
          { y: 160, label: "5/17/2022 8:47:16" },
        ],
      },
    ],
  };
  return (
    <div className="App">
      {graphData && (
        <>
          <div className="canvas">
            <div className="valuesFilter">
              <button className="filterButton">Tasks summary</button>
              <button className="filterButton" onClick={handleStoryPointsClick}>
                Story points
              </button>
            </div>
            <CanvasJSChart
              options={chartData || options}
              containerProps={{ width: "100%", height: "500px" }}
            />
          </div>
          <div className="buttonContainer">
            <span>Filter by team name</span>
            {uniqueTeams.map((team, index) => (
              <button
                className="filterButton"
                onClick={() => handleTeamFilter(team)}
                key={index}
              >
                {team}
              </button>
            ))}
          </div>
        </>
      )}
      <div>
        <Table setGraphData={setGraphData} />
      </div>
    </div>
  );
}

export default App;
