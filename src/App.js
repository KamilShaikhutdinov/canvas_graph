import CanvasJSReact from "./canvasjs.react";
import React, { useState } from "react";
import moment from "moment";

import Table from "./components/Table/Table";
import "./App.css";
import { sprintDates, sprintNames } from "./consts";

function App() {
  const [graphData, setGraphData] = useState();
  const [filteredData, setFilteredData] = useState(graphData);
  const [chartData, setChartData] = useState();
  const [activeButton, setActiveButton] = useState(null);

  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const removeFirstWord = (str) => {
    const words = str.split(" ");
    words.shift();
    return words.join(" ");
  };

  const handleTeamFilter = (team) => {
    setActiveButton(team);
    handleTaskSummaryClick();
    const filtered = graphData.filter((item) => item["Team Name"] === team);
    setFilteredData(filtered);
  };

  const uniqueTeams = graphData
    ? [...new Set(graphData?.map((item) => item["Team Name"]))]
    : [];

  const handleStoryPointsClick = () => {
    const uniqueAssignees = [
      ...new Set(filteredData?.map((item) => item.Assignee)),
    ];

    const sprintKeys = sprintNames.map((name) => name.replace("Sprint ", ""));

    const data = uniqueAssignees?.map((assignee) => ({
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
        ?.map((item) => {
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

    data.forEach((assigneeData) => {
      sprintKeys.forEach((sprintKey) => {
        const hasDataPoint = assigneeData.dataPoints.some(
          (dataPoint) => dataPoint.label === sprintKey
        );
        if (!hasDataPoint) {
          assigneeData.dataPoints.push({
            y: 0,
            label: removeFirstWord(sprintKey),
            base: -1,
          });
        }
      });
    });

    setChartData({
      animationEnabled: true,
      title: {
        text: "",
      },
      axisX: {
        title: "Sprint",
        interval: 1,
        labelAngle: -50,
        labelMaxWidth: 80,
        labelWrap: true,
        valueFormatString: "",
        labelFontSize: 12,
        tickLength: 0,
        tickColor: "rgba(0,0,0,0)",
        lineThickness: 0,
      },
      axisY: {
        minimum: 0,
        title: "Number of tasks",
      },
      toolTip: {
        shared: true,
      },
      data,
    });
  };
  const handleTaskSummaryClick = () => {
    const uniqueAssignees = [
      ...new Set(filteredData?.map((item) => item.Assignee)),
    ];

    const data = uniqueAssignees?.map((assignee) => {
      const dataPoints = sprintNames.map((sprintName) => {
        const sprintTasks = filteredData.filter(
          (item) =>
            item.Assignee === assignee &&
            moment(item["Status Category Changed"], "M/D/YYYY H:m:s").isBetween(
              moment(sprintDates[sprintName][0], "M/D/YYYY"),
              moment(sprintDates[sprintName][1], "M/D/YYYY")
            )
        );

        return {
          y: sprintTasks.length || 0,
          label: removeFirstWord(sprintName),
          base: -1,
        };
      });

      return {
        type: "spline",
        name: assignee,
        showInLegend: true,
        dataPoints,
      };
    });

    setChartData({
      theme: "light2",
      animationEnabled: true,
      title: {
        text: "",
      },
      axisX: {
        title: "Sprint",
        interval: 1,
        labelAngle: -50,
        labelMaxWidth: 80,
        labelWrap: false,
        valueFormatString: "",
        intervalType: "number",
        tickLength: 0,
        tickColor: "rgba(0,0,0,0)",
        lineThickness: 0,
        labelFontSize: 14,
      },
      axisY: {
        minimum: 0,
        title: "Number of tasks",
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
              </>
            )}
          </div>
          <div className="chartWithButtonsContainer">
            <div className="buttonContainer">
              {uniqueTeams?.map((team, index) => (
                <button
                  className={`filterButton ${
                    activeButton === team ? "active" : ""
                  }`}
                  onClick={() => handleTeamFilter(team)}
                  key={index}
                >
                  {team}
                </button>
              ))}
            </div>
            <CanvasJSChart
              options={chartData}
              containerProps={{ width: "90%", height: "800px" }}
            />
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
