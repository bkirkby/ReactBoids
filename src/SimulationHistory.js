import React, { useState } from "react";

export default function SimulationHistory(props) {
  const svgHeight = 25;
  const svgWidth = 50;
  const [history, setHistory] = useState([
    {
      vars: { distancing: 10, isolation: 10 },
      lines: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
    },
    {
      vars: { distancing: 10, isolation: 10 },
      lines: [0.25, 0.28, 0.35, 0.48, 0.533, 0.545, 0.7, 0.8]
    }
  ]);
  /*
    {
      vars: {distancing: 10, isolation: 10},
      lines: [
        {
          x:0,y:0,pecent:0.1
        }
      ]
    }
  */

  return (
    <div className="simulationHistoryContainer">
      {history.map(h => {
        return (
          <svg width={svgWidth} height={svgHeight}>
            <rect
              x="0"
              y="0"
              width={svgWidth}
              height={svgHeight}
              style={{ fill: "blue" }}
            />
            {h.lines.map((line, i) => {
              const lineHeight = svgHeight * line;
              return (
                <rect
                  x={i}
                  y={svgHeight - lineHeight}
                  width="1"
                  height={lineHeight}
                  style={{ fill: "red" }}
                />
              );
            })}
          </svg>
        );
      })}
    </div>
  );
}

/*
    <svg width="50" height="25">
    <rect x="0" y="0" width="1" height="10" style={{ fill: "red" }} />
    <rect x="1" y="0" width="1" height="15" style={{ fill: "red" }} />
    <rect x="2" y="0" width="1" height="20" style={{ fill: "red" }} />
  </svg>
*/
