import React, { useEffect, useState, useCallback, useReducer } from "react";
import sha1 from "sha1";
import createPersistedState from "use-persisted-state";

import "./styles.css";

import BirdCanvas from "./BirdCanvas";
import GraphCanvas from "./GraphCanvas";
import Swarm from "./Swarm";
import SimulationHistory from "./SimulationHistory";
import SimpleMenu from "./SimpleMenu";
import SwarmControl from "./SwarmControl";

import { createBunch } from "./boidsUtils";

const useSimHistory = createPersistedState("sim-history");

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
  const [simState, setSimState] = useState("done"); // freestyle, running, done
  const [isolationFactor, setIsolationFactor] = useState(0);
  const [sdFactor, setSdFactor] = useState(0);
  //const [simHistory, setSimHistory] = useSimHistory({});
  const [simHistory, setSimHistory] = useState({});
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const canvasNormal = document.getElementById("boidsCanvas-normal");
    setBoidsNormalCtx(canvasNormal.getContext("2d"));
    // const canvasSD = document.getElementById("boidsCanvas-sd");
    // setBoidsSDCtx(canvasSD.getContext("2d"));
    // const canvasIsolation = document.getElementById("boidsCanvas-isolation");
    // setBoidsIsolationCtx(canvasIsolation.getContext("2d"));
    setBoidsNormal(createBunch(50, 0, canvasWidth, canvasHeight));
  }, [canvasWidth, canvasHeight]);

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

  const addSimHistory = useCallback(
    graphData => {
      // construct obj
      const varObj = { sd: 0, iso: 0, pop: 50 };
      const hash = sha1(JSON.stringify(varObj));
      setSimHistory(simHistory => {
        const simHistoryForVars = simHistory[hash]
          ? simHistory[hash]
          : { vars: {}, history: [] };
        return {
          ...simHistory,
          [hash]: {
            ...simHistoryForVars,
            history: [].concat([graphData], simHistoryForVars.history)
          }
        };
      });
    },
    [setSimHistory]
  );

  const notifySimDone = useCallback(simIsDone => {
    if (simIsDone) {
      setSimState("done");
    }
  }, []);

  const shouldShowSimpleMenu = () => {
    return simState === "done";
  };

  const toggleSimpleMenu = () => {
    if (shouldShowSimpleMenu()) {
      setSimState("freestyle");
    } else {
      setSimState("done");
    }
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
          addSimHistory={addSimHistory}
          notifySimDone={notifySimDone}
        />
        <div className="countersContainer">
          <span>
            <span className="normalText">
              {zeroFill(boidsNormal.filter(b => b.state === "normal").length)}
            </span>
            <span className="infectedText">
              {zeroFill(boidsNormal.filter(b => b.state === "infected").length)}
            </span>
          </span>
          <span>
            <button
              id="menuButton"
              style={{
                borderStyle: shouldShowSimpleMenu() ? "inset" : "outset"
              }}
              onClick={() => toggleSimpleMenu()}
            >
              ...
            </button>
          </span>
        </div>
        <div className="boidContainer">
          <BirdCanvas
            id="boidsCanvas-normal"
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            opacity={shouldShowSimpleMenu() ? 0.2 : 1}
          />
          {shouldShowSimpleMenu() && (
            <SimpleMenu
              setBoids={setBoidsNormal}
              setSimState={setSimState}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              setIsolationFactor={setIsolationFactor}
              setSdFactor={setSdFactor}
              reset={reset}
            />
          )}
          <Swarm
            boidsCtx={boidsNormalCtx}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            boids={boidsNormal}
            setBoids={setBoidsNormal}
            resetCallback={reset}
            isolationFactor={isolationFactor}
            sdFactor={sdFactor}
            isPaused={isPaused}
          />

          <SwarmControl
            isolationFactor={isolationFactor}
            sdFactor={sdFactor}
            setIsolationFactor={setIsolationFactor}
            setSdFactor={setSdFactor}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            simState={simState}
            setBoids={setBoidsNormal}
            boids={boidsNormal}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            reset={reset}
          />
        </div>
        {/*<SimulationHistory
          history={simHistory}
          svgWidth={graphWidth}
          svgHeight={graphHeight}
        />*/}
      </div>
    </div>
  );
}
