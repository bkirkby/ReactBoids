import React from "react";

export default function SimulationHistory({
  svgHeight,
  svgWidth,
  history = {}
}) {
  //const [history, setHistory] = useState([
  /*{
      f23a0a93d577f575e46a32d3eae42795ada9d1d9: {
        vars: { sd: 0, iso: 0, pop: 50 },
        history: [
          [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
          [0.1, 0.15, 0.45, 0.55, 0.67, 0.68, 0.69, 0.69, 0.8, 1]
        ]
      }
    },
*/
  //]);

  return (
    <div className="simulationHistoryContainer">
      {Object.keys(history).map(hashKey => {
        return history[hashKey].history.map((graphData, i) => {
          return (
            <svg key={`histsvg-${i}`} width={svgWidth} height={svgHeight}>
              <rect
                x="0"
                y="0"
                width={svgWidth}
                height={svgHeight}
                style={{ fill: "0033ff" }}
              />
              {graphData.map((h, j) => {
                const lineHeight = svgHeight * h;
                return (
                  <rect
                    key={`histsvg-${i}-${j}`}
                    x={j}
                    y={svgHeight - lineHeight}
                    width="1"
                    height={lineHeight}
                    style={{ fill: "#ffcc00" }}
                  />
                );
              })}
            </svg>
          );
        });
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
