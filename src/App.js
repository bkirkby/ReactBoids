import React, { useEffect, useState, useCallback } from "react";
import "./styles.css";

import BirdCanvas from "./BirdCanvas";
import GraphCanvas from "./GraphCanvas";
import Swarm from "./Swarm";
import SimulationHistory from "./SimulationHistory";

export default function App() {
  const [boidsNormalCtx, setBoidsNormalCtx] = useState();
  // const [boidsSDCtx, setBoidsSDCtx] = useState();
  // const [boidsIsolationCtx, setBoidsIsolationCtx] = useState();
  const [canvasWidth] = useState(400);
  const [canvasHeight] = useState(350);
  const [graphWidth] = useState(400);
  const [graphHeight] = useState(50);
  const [boidsNormal, setBoidsNormal] = useState([]);
  const [resetCbs, setResetCbs] = useState([]);
  // const [boidsSD, setBoidsSD] = useState([]);
  // const [boidsIsolation, setBoidsIsolation] = useState([]);

  useEffect(() => {
    const canvasNormal = document.getElementById("boidsCanvas-normal");
    setBoidsNormalCtx(canvasNormal.getContext("2d"));
    // const canvasSD = document.getElementById("boidsCanvas-sd");
    // setBoidsSDCtx(canvasSD.getContext("2d"));
    // const canvasIsolation = document.getElementById("boidsCanvas-isolation");
    // setBoidsIsolationCtx(canvasIsolation.getContext("2d"));
  }, []);

  const zeroFill = num => {
    let ret = "";
    const maxLen = 4;
    for (let i = maxLen - ("" + num).length; i > 0; i--) {
      ret += "0";
    }
    return ret + num;
  };

  const addResetListener = useCallback(rl => {
    setResetCbs(rcb => [...rcb, rl]);
  }, []);

  const reset = () => {
    resetCbs.forEach(f => {
      f();
    });
  };

  return (
    <div className="app">
      <div className="normalContainer">
        <GraphCanvas
          boids={boidsNormal}
          canvasWidth={graphWidth}
          canvasHeight={graphHeight}
          id={"graphCanvas-normal"}
          addResetListener={addResetListener}
        />
        <div className="counters">
          <span className="normal">
            {zeroFill(boidsNormal.filter(b => b.state === "normal").length)}
          </span>
          <span className="infected">
            {zeroFill(boidsNormal.filter(b => b.state === "infected").length)}
          </span>
        </div>
        <div className="boidContainer">
          <BirdCanvas
            id="boidsCanvas-normal"
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
          />
          <Swarm
            boidsCtx={boidsNormalCtx}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            boids={boidsNormal}
            setBoids={setBoidsNormal}
            resetCallback={reset}
          />
        </div>
        <SimulationHistory svgWidth={graphWidth} svgHeight={graphHeight} />
      </div>
    </div>
  );
}
