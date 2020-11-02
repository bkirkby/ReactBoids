import React, { useEffect, useState, useCallback, useReducer } from "react";
import sha1 from "sha1";
import createPersistedState from "use-persisted-state";

import "./styles.css";

import BirdCanvas from "./BirdCanvas";
import GraphCanvas from "./GraphCanvas";
import Swarm from "./Swarm";
// import SimulationHistory from "./SimulationHistory";
import SimpleMenu from "./SimpleMenu";
import ReplayMenu from "./ReplayMenu";
import SwarmControl from "./SwarmControl";
import About from "./About";
import SwarmCounters from "./SwarmCounters";

import { createBunch, BUNCH_SIZE } from "./boidsUtils";
// import { generateNewBoid } from "./Boid";

import { sendGraphRun } from './api';

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
  // const [freeStyleMode, toggleFreeStyleMode] = useReducer(v => !v, false);
  const [flockSize, setFlockSize] = useState(BUNCH_SIZE);

  useEffect(() => {
    const canvasNormal = document.getElementById("boidsCanvas-normal");
    setBoidsNormalCtx(canvasNormal.getContext("2d"));

    setBoidsNormal(createBunch(flockSize, 0, canvasWidth, canvasHeight));
  }, [canvasWidth, canvasHeight, flockSize]);

  useEffect(() => {
    if (simState === "running") {
      setShowSimpleMenu(false);
    }
  }, [simState]);

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
    boidData => {
      if (boidData && simState === 'running') {
        // console.log('bk: simIsDone: ', simIsDone, process.env.REACT_APP_API_SERVER);
        const graphData = {
          ...boidData,
          isolation: isolationFactor,
          social_distance: Number((sdFactor / 5).toFixed(1))
        }
        // console.log('bk: graphrun: ', graphData);
        setSimState("done");
        setShowSimpleMenu(true);
        sendGraphRun(graphData);
      }
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
              isolationFactor={isolationFactor}
              setSdFactor={setSdFactor}
              sdFactor={sdFactor}
              reset={reset}
              setShowAbout={setShowAbout}
              setFlockSize={setFlockSize}
              flockSize={flockSize}
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

          {/* <SwarmControl
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
          /> */}
          <SwarmControl
            isolationFactor={isolationFactor}
            setIsolationFactor={setIsolationFactor}
            sdFactor={sdFactor}
            setSdFactor={setSdFactor}
            flockSize={flockSize}
            setFlockSize={setFlockSize}
            simState={simState}
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
