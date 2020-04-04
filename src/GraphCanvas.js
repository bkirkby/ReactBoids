import React, { useEffect, useState } from "react";

export default function GraphCanvas({ canvasWidth, canvasHeight, boids }) {
  const [ctx, setCtx] = useState();
  const [boidGraph, setBoidGraph] = useState([]); // {numInfected:0, numNormal:0}

  useEffect(() => {
    // clearCanvas
    // if (ctx) {
    //   ctx.beginPath();
    //   ctx.fillStyle = "red";
    //   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //   ctx.closePath();
    // }
    // drawGraph
    const lineWidth = 2;
    if (ctx) {
      boidGraph.forEach((bg, i) => {
        const infectedHeight = (bg.numInfected / bg.numNormal) * canvasHeight;
        const normalHeight = canvasHeight - infectedHeight;

        // infected
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(
          i * lineWidth,
          canvasHeight - infectedHeight,
          lineWidth,
          infectedHeight
        );
        ctx.closePath();

        // normal
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(i * lineWidth, 0, lineWidth, normalHeight);
        ctx.closePath();
      });
    }
  }, [ctx, boidGraph, canvasHeight, canvasWidth]);

  const stepBoidGraph = () => {
    setBoidGraph([
      ...boidGraph,
      {
        numNormal: boids.length,
        numInfected: boids.filter(b => b.state === "infected").length
      }
    ]);
  };

  useEffect(() => {
    setCtx(document.getElementById("graph").getContext("2d"));
    // setInterval(()=>{
    //   stepBoidGraph();
    // }, 1000);
  }, []);

  return (
    <>
      <canvas id="graph" width={canvasWidth} height={canvasHeight} />
      <button onClick={() => stepBoidGraph()}>step</button>
    </>
  );
}
