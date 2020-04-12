import React, { useEffect, useState, useCallback } from "react";

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
        const infectedHeight = (bg.numInfected / bg.numNormal) * canvasHeight;
        const normalHeight = canvasHeight - infectedHeight;

        // infected
        ctx.beginPath();
        ctx.fillStyle = "#ffcc00";
        ctx.fillRect(
          i * lineWidth,
          canvasHeight - infectedHeight,
          lineWidth,
          infectedHeight
        );
        ctx.closePath();

        // normal
        ctx.beginPath();
        ctx.fillStyle = "#0033ff";
        ctx.fillRect(i * lineWidth, 0, lineWidth, normalHeight);
        ctx.closePath();
      });
    }
  }, [ctx, boidGraph, canvasHeight, canvasWidth]);

  // const handleStepBoidGraph = e => {
  //   e.preventDefault();
  //   const numInfected = boids.filter(b => b.state === "infected").length;
  //   const numTotal = boids.length;
  //   if (numInfected < numTotal) {
  //     setBoidGraph(boidGraph => {
  //       return [
  //         ...boidGraph,
  //         {
  //           numNormal: numTotal,
  //           numInfected: numInfected
  //         }
  //       ];
  //     });
  //   }
  // };

  const shouldUpdateBoidGraph = useCallback(() => {
    const graphUpdateInterval = 60;
    return lastGraphUpdate + graphUpdateInterval <= Date.now();
  }, [lastGraphUpdate]);

  useEffect(() => {
    setCtx(document.getElementById(id).getContext("2d"));
  }, [id]);

  useEffect(() => {
    setLastGraphUpdate(Date.now());
  }, [boidGraph]);

  useEffect(() => {
    // updateBoidGraph
    const numInfected = boids.filter(b => b.state === "infected").length;
    if (shouldUpdateBoidGraph()) {
      if (boids.length && numInfected === boids.length) {
        // all are infected, so see if we need to include the final
        // boidGraph
        setBoidGraph(boidGraph => {
          const lastNumNormal = boidGraph.length
            ? boidGraph[boidGraph.length - 1].numNormal
            : 0;
          const lastNumInfected = boidGraph.length
            ? boidGraph[boidGraph.length - 1].numInfected
            : 0;
          if (lastNumNormal > lastNumInfected) {
            return [
              ...boidGraph,
              { numNormal: boids.length, numInfected: boids.length }
            ];
          }
          setIsGraphDone(true);
          return boidGraph;
        });
      } else if (boids.length && numInfected < boids.length && numInfected) {
        // some are infected and not all are infected
        setBoidGraph(boidGraph => {
          // only add to boidGraph if we have canvas space to show it
          if (boidGraph.length < canvasWidth) {
            return [
              ...boidGraph,
              {
                numNormal: boids.length,
                numInfected: boids.filter(b => b.state === "infected").length
              }
            ];
          }
          setIsGraphDone(true);
          return boidGraph;
        });
      }
    }
  }, [boids, shouldUpdateBoidGraph, canvasWidth]);

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
