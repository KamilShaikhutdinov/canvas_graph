import "./App.css";
import CanvasJSReact from "./canvasjs.react";
import React, { useState } from "react";
import Papa from "papaparse";
import Table from "./components/Table/Table";

function App() {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const allowedExtensions = ["csv"];

  const options = {
    animationEnabled: true,
    title: {
      text: "Number of New Customers",
    },
    axisY: {
      title: "Number of Customers",
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "spline",
        name: "2016",
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
        name: "2017",
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
  // This state will store the parsed data
  const [data, setData] = useState([]);
  const [isDataUploaded, setDataUploaded] = useState(false);

  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");
  console.log(error);

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };

  // const table = (
  //   <table>
  //     <tr key={"header"}>
  //       {Object.keys(data[0]).map((key) => (
  //         <th>{key}</th>
  //       ))}
  //     </tr>
  //     {data.map((item) => (
  //       <tr key={item.id}>
  //         {Object.values(item).map((val) => (
  //           <td>{val}</td>
  //         ))}
  //       </tr>
  //     ))}
  //   </table>
  // );
  const handleParse = () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      setData(parsedData);
      setDataUploaded(true);
    };
    reader.readAsText(file);
  };
  return (
    <div className="App">
      <div>
        <CanvasJSChart
          options={options}
          containerProps={{ width: "50%", height: "300px" }}
        />
      </div>
      <div>
        <label htmlFor="csvInput" style={{ display: "block" }}>
          Enter CSV File
        </label>
        <input
          onChange={handleFileChange}
          id="csvInput"
          name="file"
          type="File"
        />
        <div>
          <button onClick={handleParse}>Parse</button>
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
        {/* <Table></Table> */}
      </div>
    </div>
  );
}

export default App;
