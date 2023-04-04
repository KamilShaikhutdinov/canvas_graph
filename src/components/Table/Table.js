// import "./App.css";
import React, { useState } from "react";

function Table() {
  const [data, setData] = useState([]);
  const [isDataUploaded, setDataUploaded] = useState(false);

  return (
    <>
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
