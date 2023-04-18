import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./Uploader.css";

function Uploader({ setGraphData, setUniqueTeamNames }) {
  const [data, setData] = useState();
  const [error, setError] = useState("");
  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");

  useEffect(() => {
    setGraphData(data);
  }, [data, setGraphData]);

  const allowedExtensions = ["csv"];

  const handleFile1Change = (e) => {
    setError("");

    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      setFile1(inputFile);
    }
  };
  const handleFile2Change = (e) => {
    setError("");

    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      setFile2(inputFile);
    }
  };

  const handleParse = () => {
    if (!file1 || !file2) return setError("Enter valid files");

    Promise.all([
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = ({ target }) => {
          const csv = Papa.parse(target.result, { header: true });
          resolve(csv?.data);
        };
        reader.readAsText(file1);
      }),
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = ({ target }) => {
          const csv = Papa.parse(target.result, { header: true });
          resolve(csv?.data);
        };
        reader.readAsText(file2);
      }),
    ]).then(([parsedData1, parsedData2]) => {
      function mergeArrays(parsedData1, parsedData2) {
        const result = [];

        parsedData2.forEach((obj2) => {
          const assignee = obj2["Assignee"];
          const obj1 = parsedData1.find(
            (obj1) => obj1["Employee name"] === assignee
          );

          if (obj1) {
            const mergedObj = { ...obj2, "Team name": obj1["Team name"] };
            result.push(mergedObj);
          }
        });

        return result;
      }
      const result = mergeArrays(parsedData1, parsedData2);
      setData(result);
      if (result) {
        const teamNames = result?.map((item) => item["Team name"]);
        setUniqueTeamNames([...new Set(teamNames)]);
      }
    });
  };

  return (
    <>
      <div className="parseForm">
        <label for="csvInput" style={{ display: "block" }}>
          <h2>Upload Teams File</h2>
        </label>
        <input
          onChange={handleFile1Change}
          id="csvInput"
          name="file"
          type="File"
          className="uploadButton"
        />
        <label for="csvInput" style={{ display: "block" }}>
          <h2>Upload Data points File</h2>
        </label>
        <input
          onChange={handleFile2Change}
          id="csvInput"
          name="file"
          type="File"
          className="uploadButton"
        />
        <div>
          <button onClick={handleParse} className="parseButton">
            Parse
          </button>
        </div>
        <span className="error">{error}</span>
      </div>
    </>
  );
}

export default Uploader;
