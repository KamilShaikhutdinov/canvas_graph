import CanvasJSReact from "./canvasjs.react";
import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";

import Uploader from "./components/Uploader/Uploader";
import "./App.css";
import { sprintDates, sprintNames } from "./consts";

function App() {
  const [graphData, setGraphData] = useState();
  const [filteredData, setFilteredData] = useState(graphData);
  const [chartData, setChartData] = useState();
  const [activeButton, setActiveButton] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const removeFirstWord = (str) => {
    const words = str.split(" ");
    words.shift();
    return words.join(" ");
  };

  const handleTeamFilter = (team) => {
    setSelectedTeam(team);
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

    const data = uniqueAssignees?.map((assignee) => {
      const assigneeDataPoints = [];
      sprintNames.forEach((sprintKey) => {
        let sprintDataPoint = {
          y: 0,
          label: removeFirstWord(sprintKey),
          base: -1,
        };
        filteredData.forEach((item) => {
          if (item.Assignee === assignee) {
            const date = moment(
              item["Status Category Changed"],
              "M/D/YYYY H:m:s"
            );
            const sprintStartDate = moment(
              sprintDates[sprintKey][0],
              "M/D/YYYY"
            );
            const sprintEndDate = moment(sprintDates[sprintKey][1], "M/D/YYYY");
            if (
              date.isBetween(sprintStartDate, sprintEndDate, undefined, "[]")
            ) {
              sprintDataPoint.y += parseFloat(item["Story Points"]) || 0;
            }
          }
        });
        assigneeDataPoints.push(sprintDataPoint);
      });
      return {
        type: "spline",
        name: assignee,
        showInLegend: true,
        dataPoints: assigneeDataPoints,
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
        interval: 2,
        labelAngle: -50,
        labelMaxWidth: 80,
        labelWrap: true,
        valueFormatString: "",
        labelFontSize: 12,
        tickLength: 2,
        tickColor: "rgba(0,0,0,0)",
        lineThickness: 0,
        minimum: -1,
        dataPoints: sprintNames.map((sprintKey) => ({
          label: removeFirstWord(sprintKey),
        })),
      },
      axisY: {
        minimum: -1,
        title: "Story points",
      },
      toolTip: {
        shared: true,
      },
      data,
    });
  };

  const handleTaskSummaryClick = useCallback(() => {
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
        minimum: -1,
        title: "Number of tasks",
      },
      toolTip: {
        shared: true,
      },
      data,
    });
  }, [filteredData]);

  useEffect(() => {
    if (selectedTeam) {
      handleTaskSummaryClick();
    }
  }, [selectedTeam, handleTaskSummaryClick]);

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
        <Uploader setGraphData={setGraphData} />
      </div>
    </div>
  );
}

export default App;
