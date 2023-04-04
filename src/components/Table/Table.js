import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./Table.css";

function Table({ setGraphData }) {
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
        <label htmlFor="csvInput" style={{ display: "block" }}>
          Upload CSV File
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
      {isDataUploaded && (
        <div style={{ marginTop: "3rem" }}>
          {
            <table>
              <tr key={"header"}>
                {Object.keys(data[0]).map((key) => (
                  <th>{key}</th>
                ))}
              </tr>
              {data.map((item) => (
                <tr key={item.id}>
                  {Object.values(item).map((val) => (
                    <td>{val}</td>
                  ))}
                </tr>
              ))}
            </table>
          }
        </div>
      )}
    </>
  );
}

export default Table;
