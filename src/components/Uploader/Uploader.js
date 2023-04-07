import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./Uploader.css";

function Uploader({ setGraphData }) {
  const [data, setData] = useState();
  const [isDataUploaded, setDataUploaded] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");

  useEffect(() => {
    setGraphData(data);
  }, [data, setGraphData]);

  const allowedExtensions = ["csv"];

  const handleFileChange = (e) => {
    setError("");

    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      setFile(inputFile);
    }
  };

  const handleParse = () => {
    if (!file) return setError("Enter a valid file");

    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      setData(parsedData);
      setDataUploaded(true);
    };
    reader.readAsText(file);
  };
  return (
    <>
      <div className="parseForm">
        <label for="csvInput" style={{ display: "block" }}>
          <h2>Upload CSV File</h2>
        </label>
        <input
          onChange={handleFileChange}
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
