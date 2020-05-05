import React, { useEffect, useState, useCallback } from "react";

import { infectionStateColors } from "./Boid";

export default function GraphCanvas({
  canvasWidth,
  canvasHeight,
  boids,
  id,
  addResetListener,
  addSimHistory,
  notifySimDone
}) {
  const [ctx, setCtx] = useState();
  const [boidGraph, setBoidGraph] = useState([]); // {numInfected:0, numNormal:0}
  const [lastGraphUpdate, setLastGraphUpdate] = useState(Date.now());
  const [isGraphDone, setIsGraphDone] = useState(false);

  useEffect(() => {
    // notify that graph is done
    if (isGraphDone) {
      const histGraph = boidGraph.map(bg => {
        return bg.numInfected / bg.numNormal;
      });
      //console.log("bk: GraphCanvas.js: GraphCanvas: histGraph: ", histGraph);
      addSimHistory(histGraph);
      setIsGraphDone(false);
      notifySimDone(true);
    }
  }, [isGraphDone, boidGraph, addSimHistory, notifySimDone]);

  useEffect(() => {
    addResetListener(() => {
      setBoidGraph([]);
      setIsGraphDone(false);
    });
  }, [addResetListener]);

  useEffect(() => {
    // drawGraph
    const lineWidth = 1;
    if (ctx) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      boidGraph.forEach((bg, i) => {
        const infectedHeight = (bg.numInfected / bg.numTotal) * canvasHeight;
        const immuneHeight = (bg.numImmune / bg.numTotal) * canvasHeight;
        const normalHeight = (bg.numNormal / bg.numTotal) * canvasHeight;
        const deadHeight = (bg.numDead / bg.numTotal) * canvasHeight;

        // normal
        ctx.beginPath();
        ctx.fillStyle = infectionStateColors["normal"];
        ctx.fillRect(i * lineWidth, 0, lineWidth, normalHeight);
        ctx.closePath();

        // infected
        ctx.beginPath();
        ctx.fillStyle = infectionStateColors["infected"];
        ctx.fillRect(i * lineWidth, normalHeight, lineWidth, infectedHeight);
        ctx.closePath();

        // immune
        ctx.beginPath();
        ctx.fillStyle = infectionStateColors["immune"];
        ctx.fillRect(
          i * lineWidth,
          normalHeight + infectedHeight,
          lineWidth,
          immuneHeight
        );
        ctx.closePath();

        // dead
        ctx.beginPath();
        ctx.fillStyle = infectionStateColors["dead"];
        ctx.fillRect(
          i * lineWidth,
          normalHeight + infectedHeight + immuneHeight,
          lineWidth,
          deadHeight
        );
        ctx.closePath();
      });
    }
  }, [ctx, boidGraph, canvasHeight, canvasWidth]);

  const shouldUpdateBoidGraph = useCallback(() => {
    const graphUpdateInterval = 60;
    const numInfected = boids.filter(b => b.state === "infected").length;
    return lastGraphUpdate + graphUpdateInterval <= Date.now();
  }, [lastGraphUpdate, boids]);

  useEffect(() => {
    setCtx(document.getElementById(id).getContext("2d"));
  }, [id]);

  useEffect(() => {
    setLastGraphUpdate(Date.now());
  }, [boidGraph]);

  useEffect(() => {
    // updateBoidGraph
    const numInfected = boids.filter(b => b.state === "infected").length;
    const numImmune = boids.filter(b => b.state === "immune").length;
    if (shouldUpdateBoidGraph()) {
      if (
        (numInfected === 0 && numImmune > 0) ||
        boidGraph.length >= canvasWidth
      ) {
        // we are done
        setIsGraphDone(true);
      } else {
        // update graph
        setBoidGraph(boidGraph => {
          // only add to boidGraph if we have canvas space to show it
          if (boidGraph.length < canvasWidth) {
            return [
              ...boidGraph,
              {
                numTotal: boids.length,
                numNormal: boids.filter(b => b.state === "normal").length,
                numInfected: boids.filter(b => b.state === "infected").length,
                numImmune: boids.filter(b => b.state === "immune").length,
                numDead: boids.filter(b => b.state === "dead").length
              }
            ];
          }
          // setIsGraphDone(true);
          return boidGraph;
        });
      }
    }
  }, [boids, shouldUpdateBoidGraph, canvasWidth, boidGraph.length]);

  return (
    <div className="graphContainer">
      <canvas id={id} width={canvasWidth} height={canvasHeight} />
      {/*<div>
        <button onClick={handleStepBoidGraph}>step</button>
        <button
          onClick={() => {
            setBoidGraph([]);
          }}
        >
          reset
        </button>
        </div>*/}
    </div>
  );
}
