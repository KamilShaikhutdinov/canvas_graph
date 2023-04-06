import CanvasJSReact from "./canvasjs.react";
import React, { useState } from "react";
import moment from "moment";

import Table from "./components/Table/Table";
import "./App.css";
import { sprintDates } from "./consts";

function App() {
  const [graphData, setGraphData] = useState();
  const [filteredData, setFilteredData] = useState(graphData);
  const [chartData, setChartData] = useState();
  console.log(filteredData);
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
        .sort((a, b) => {
          const dateA = new Date(a["Status Category Changed"]);
          const dateB = new Date(b["Status Category Changed"]);
          return dateA - dateB;
        })
        .map((item) => {
          const date = moment(
            item["Status Category Changed"],
            "M/D/YYYY H:m:s"
          );
          let sprintKey = "";

          Object.entries(sprintDates).forEach(([key, value]) => {
            const startDate = moment(value[0], "M/D/YYYY");
            const endDate = moment(value[1], "M/D/YYYY");

            if (date.isBetween(startDate, endDate)) {
              sprintKey = key;
            }
          });

          return {
            y: parseFloat(item["Story Points"]) || 0,
            label: sprintKey,
            base: -1,
          };
        }),
    }));

    setChartData({
      animationEnabled: true,
      title: {
        text: "Rustik's data",
      },
      axisY: {
        minimum: -1,
        title: "Story Points",
      },
      toolTip: {
        shared: true,
      },
      data,
    });
  };
  const handleTaskSummaryClick = () => {
    const uniqueAssignees = [
      ...new Set(filteredData.map((item) => item.Assignee)),
    ];
    const data = uniqueAssignees.map((assignee) => ({
      type: "spline",
      name: assignee,
      showInLegend: true,
      dataPoints: filteredData
        .filter((item) => item.Assignee === assignee)
        .sort((a, b) => {
          const dateA = new Date(a["Status Category Changed"]);
          const dateB = new Date(b["Status Category Changed"]);
          return dateA - dateB;
        })
        .reduce((accumulator, item) => {
          const date = moment(
            item["Status Category Changed"],
            "M/D/YYYY H:m:s"
          );
          let sprintKey = "";

          Object.entries(sprintDates).forEach(([key, value]) => {
            const startDate = moment(value[0], "M/D/YYYY");
            const endDate = moment(value[1], "M/D/YYYY");

            if (date.isBetween(startDate, endDate)) {
              sprintKey = key;
            }
          });

          const existingDataPointIndex = accumulator.findIndex(
            (dataPoint) => dataPoint.label === sprintKey
          );

          if (existingDataPointIndex !== -1) {
            accumulator[existingDataPointIndex].y += 1;
          } else {
            accumulator.push({
              y: 1,
              label: sprintKey,
              base: -1,
            });
          }

          return accumulator;
        }, []),
    }));

    setChartData({
      animationEnabled: true,
      title: {
        text: "Rustik's data",
      },
      axisY: {
        minimum: -1,
        title: "Number of Items",
      },
      toolTip: {
        shared: true,
      },
      data,
    });
  };
  return (
    <div className="App">
      {graphData && (
        <>
          <div className="canvas">
            {filteredData && (
              <>
                <div className="valuesFilter">
                  <button
                    className="filterButton"
                    onClick={handleTaskSummaryClick}
                  >
                    Task summary
                  </button>
                  <button
                    className="filterButton"
                    onClick={handleStoryPointsClick}
                  >
                    Story points
                  </button>
                </div>
                <CanvasJSChart
                  options={chartData}
                  containerProps={{ width: "100%", height: "500px" }}
                />
              </>
            )}
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
