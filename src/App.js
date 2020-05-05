import React, { useEffect, useState, useCallback, useReducer } from "react";
import sha1 from "sha1";
import createPersistedState from "use-persisted-state";

import "./styles.css";

import BirdCanvas from "./BirdCanvas";
import GraphCanvas from "./GraphCanvas";
import Swarm from "./Swarm";
import SimulationHistory from "./SimulationHistory";
import SimpleMenu from "./SimpleMenu";
import ReplayMenu from "./ReplayMenu";
import SwarmControl from "./SwarmControl";
import About from "./About";
import SwarmCounters from "./SwarmCounters";

import { createBunch, BUNCH_SIZE } from "./boidsUtils";
import { generateNewBoid } from "./Boid";

const useSimHistory = createPersistedState("sim-history");

export default function App() {
  const [boidsNormalCtx, setBoidsNormalCtx] = useState();
  // const [boidsSDCtx, setBoidsSDCtx] = useState();
  // const [boidsIsolationCtx, setBoidsIsolationCtx] = useState();
  const [canvasWidth] = useState(500);
  const [canvasHeight] = useState(350);
  const [graphWidth] = useState(500);
  const [graphHeight] = useState(50);
  const [boidsNormal, setBoidsNormal] = useState([]);
  const [resetCbs, setResetCbs] = useState([]);
  const [simState, setSimState] = useState("done"); // running, done
  const [isolationFactor, setIsolationFactor] = useState(0);
  const [sdFactor, setSdFactor] = useState(0);
  //const [simHistory, setSimHistory] = useSimHistory({});
  const [simHistory, setSimHistory] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSimpleMenu, setShowSimpleMenu] = useState(true);
  const [showReplay, setShowReplay] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [freeStyleMode, toggleFreeStyleMode] = useReducer(v => !v, false);

  useEffect(() => {
    const canvasNormal = document.getElementById("boidsCanvas-normal");
    setBoidsNormalCtx(canvasNormal.getContext("2d"));

    setBoidsNormal(createBunch(BUNCH_SIZE, 0, canvasWidth, canvasHeight));
    // setBoidsNormal([
    //   {
    //     ...generateNewBoid(),
    //     x: canvasWidth / 2,
    //     y: canvasHeight / 2,
    //     state: "dead",
    //     speed: 0,
    //     infectedTime: 0
    //   }
    // ]);
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    if (simState === "running") {
      setShowSimpleMenu(false);
    }
  }, [simState]);

  // useEffect(() => {
  //   if (freeStyleMode) {
  //     setShowSimpleMenu(false);
  //   }
  // }, [freeStyleMode]);

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

  const notifySimDone = useCallback(
    simIsDone => {
      if (simIsDone) {
        setSimState("done");
      }
      // setShowReplay(!showSimpleMenu);
      // setShowSimpleMenu(true);
      // console.log(
      //   "bk: App.js: notifySimDone: sim run time: ",
      //   Date.now() -
      //     boidsNormal
      //       .filter(b => b.infectedTime)
      //       .reduce((acc, val) =>
      //         acc.infectedTime > val.infectedTime ? val : acc
      //       )
      // );
    },
    [boidsNormal]
  );

  return (
    <div className="app">
      {showAbout && <About setShowAbout={setShowAbout} />}
      <div className="normalContainer" style={{ opacity: showAbout ? 0.2 : 1 }}>
        <GraphCanvas
          boids={boidsNormal}
          canvasWidth={graphWidth}
          canvasHeight={graphHeight}
          id={"graphCanvas-normal"}
          addResetListener={addResetListener}
          addSimHistory={addSimHistory}
          notifySimDone={notifySimDone}
        />
        <SwarmCounters
          boids={boidsNormal}
          showSimpleMenu={showSimpleMenu}
          setShowSimpleMenu={setShowSimpleMenu}
        />
        <div className="boidContainer">
          <BirdCanvas
            id="boidsCanvas-normal"
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            opacity={showSimpleMenu ? 0.2 : 1}
          />
          {showSimpleMenu && (
            <SimpleMenu
              setBoids={setBoidsNormal}
              setSimState={setSimState}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              setIsolationFactor={setIsolationFactor}
              setSdFactor={setSdFactor}
              reset={reset}
              setShowAbout={setShowAbout}
              toggleFreeStyleMode={toggleFreeStyleMode}
              freeStyleMode={freeStyleMode}
              setShowSimpleMenu={setShowSimpleMenu}
            />
          )}
          {showReplay && <ReplayMenu />}
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
            freeStyleMode={freeStyleMode}
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
