import React, { useEffect, useState } from "react";
import "./styles.css";

import BirdCanvas from "./BirdCanvas";
import GraphCanvas from "./GraphCanvas";
import Swarm from "./Swarm";
import SimulationHistory from "./SimulationHistory";

export default function App() {
  const [boidsNormalCtx, setBoidsNormalCtx] = useState();
  // const [boidsSDCtx, setBoidsSDCtx] = useState();
  // const [boidsIsolationCtx, setBoidsIsolationCtx] = useState();
  const [canvasWidth] = useState(300);
  const [canvasHeight] = useState(200);
  const [boidsNormal, setBoidsNormal] = useState([]);
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

  return (
    <div className="app">
      <div className="normalContainer">
        <GraphCanvas
          boids={boidsNormal}
          canvasWidth={canvasWidth}
          canvasHeight={50}
          id={"graphCanvas-normal"}
        />
        <div className="counters" style={{ flexBasis: canvasWidth }}>
          <span className="normal">{zeroFill(boidsNormal.length)}</span>
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
          />
        </div>
        <SimulationHistory />
      </div>
      {/*<div className="sdContainer">
        <h2>social distancing</h2>
        <GraphCanvas
          boids={boidsSD}
          canvasWidth={canvasWidth}
          canvasHeight={50}
          id={"graphCanvas-sd"}
        />
        <div className="counters" style={{ flexBasis: canvasWidth }}>
          <span className="normal">{zeroFill(boidsSD.length)}</span>
          <span className="infected">
            {zeroFill(boidsSD.filter(b => b.state === "infected").length)}
          </span>
        </div>
        <div className="boidContainer">
          <BirdCanvas
            id="boidsCanvas-sd"
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
          />
          <Swarm
            boidsCtx={boidsSDCtx}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            boids={boidsSD}
            setBoids={setBoidsSD}
          />
        </div>
      </div>
      <div className="isoContainer">
        <h2>isolation</h2>
        <GraphCanvas
          boids={boidsIsolation}
          canvasWidth={canvasWidth}
          canvasHeight={50}
          id={"graphCanvas-isolation"}
        />
        <div className="counters" style={{ flexBasis: canvasWidth }}>
          <span className="normal">{zeroFill(boidsIsolation.length)}</span>
          <span className="infected">
            {zeroFill(
              boidsIsolation.filter(b => b.state === "infected").length
            )}
          </span>
        </div>
        <div className="boidContainer">
          <BirdCanvas
            id="boidsCanvas-isolation"
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
          />
          <Swarm
            boidsCtx={boidsIsolationCtx}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            boids={boidsIsolation}
            setBoids={setBoidsIsolation}
          />
            </div>
      </div>*/}
    </div>
  );
}
