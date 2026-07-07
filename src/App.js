import React, { useEffect, useState, useCallback, useReducer, useRef } from "react";
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

import { createBunch, BUNCH_SIZE, infectRandomBoid } from "./boidsUtils";
import { track } from "./analytics";
// import { generateNewBoid } from "./Boid";

const useSimHistory = createPersistedState("sim-history");

// reference density: 100 boids comfortably filled the original 500x350 canvas
const BOID_DENSITY = 100 / (500 * 350);
// derive a population from a canvas area, snapped to the slider's step of 20
const areaToPopulation = (area, mult = 1) =>
  Math.max(20, Math.round((area * BOID_DENSITY * mult) / 20) * 20);

const PlayIcon = () => (
  <svg className="simToggleIcon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const StopIcon = () => (
  <svg className="simToggleIcon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" />
  </svg>
);

// build a summary of a run that just ended.
// reason: "cleared" (no infected left) | "stopped" (manually stopped)
const buildSummary = (reason, boids, startMs) => {
  const total = boids.length;
  const everSick = boids.filter(
    b => b.state === "infected" || b.state === "immune" || b.state === "dead"
  ).length;
  return {
    reason,
    pctSick: total > 0 ? Math.round((everSick / total) * 100) : 0,
    durationMs: startMs ? Date.now() - startMs : 0
  };
};

export default function App() {
  const [boidsNormalCtx, setBoidsNormalCtx] = useState();
  // const [boidsSDCtx, setBoidsSDCtx] = useState();
  // const [boidsIsolationCtx, setBoidsIsolationCtx] = useState();
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(350);
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
  const [showSimpleMenu, setShowSimpleMenu] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  // const [freeStyleMode, toggleFreeStyleMode] = useReducer(v => !v, false);
  const [flockSize, setFlockSize] = useState(BUNCH_SIZE);

  const canvasWrapRef = useRef(null);
  // read the latest simState from effects without re-subscribing them
  const simStateRef = useRef(simState);
  simStateRef.current = simState;
  // becomes true after the canvas has been measured at least once; gates the
  // one-time auto-start so the first run uses the real (fluid) canvas size
  const [canvasMeasured, setCanvasMeasured] = useState(false);
  const autoStartedRef = useRef(false);
  // wall-clock start of the current run, and the summary of the last one
  const runStartRef = useRef(null);
  const [summary, setSummary] = useState(null);

  // population slider ceiling scales with the canvas area (~2x the default)
  const flockSizeMax = Math.max(40, areaToPopulation(canvasWidth * canvasHeight, 2));

  // grab the drawing context once the canvas is mounted
  useEffect(() => {
    const canvasNormal = document.getElementById("boidsCanvas-normal");
    if (canvasNormal) {
      setBoidsNormalCtx(canvasNormal.getContext("2d"));
    }
  }, []);

  // measure the space the canvas fills and keep the drawing buffer in sync
  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.floor(el.clientWidth);
      const h = Math.floor(el.clientHeight);
      if (w > 0 && h > 0) {
        setCanvasWidth(w);
        setCanvasHeight(h);
        setCanvasMeasured(true);
      }
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // default the population from the canvas area (preserves the original
  // density), only while idle so a running sim is never disturbed
  useEffect(() => {
    if (simStateRef.current === "running") return;
    setFlockSize(areaToPopulation(canvasWidth * canvasHeight));
  }, [canvasWidth, canvasHeight]);

  // (re)seed the idle swarm when the size or population changes
  useEffect(() => {
    if (simStateRef.current === "running") return;
    setBoidsNormal(createBunch(flockSize, 0, canvasWidth, canvasHeight));
  }, [canvasWidth, canvasHeight, flockSize]);

  // on first load, immediately start an unconstrained run so the first thing
  // visitors see is the boids in motion (rather than the menu). Waits for the
  // canvas to be measured so the run uses the real fluid size.
  useEffect(() => {
    if (autoStartedRef.current || !canvasMeasured || !boidsNormalCtx) return;
    autoStartedRef.current = true;
    const pop = areaToPopulation(canvasWidth * canvasHeight);
    setFlockSize(pop);
    const newBoids = createBunch(pop, 0, canvasWidth, canvasHeight);
    setBoidsNormal(infectRandomBoid(newBoids));
    setSimState("running");
  }, [canvasMeasured, boidsNormalCtx, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (simState === "running") {
      setShowSimpleMenu(false);
      runStartRef.current = Date.now();
      setSummary(null);
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

  // start a run using the current slider parameters (same as the "fine tuned"
  // menu preset); used by the play button
  const startRun = () => {
    track("run_start", { source: "play" });
    reset();
    setSimState("running");
    const newBoids = createBunch(
      flockSize,
      isolationFactor,
      canvasWidth,
      canvasHeight
    );
    setBoidsNormal(infectRandomBoid(newBoids));
  };

  // stop the current run and bring the menu back
  const stopRun = () => {
    track("run_stop");
    setSummary(buildSummary("stopped", boidsNormal, runStartRef.current));
    setSimState("done");
    setShowSimpleMenu(true);
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
        setSummary(buildSummary("cleared", boidsNormal, runStartRef.current));
        setSimState("done");
        setShowSimpleMenu(true);
      }
    },
    [boidsNormal]
  );

  return (
    <div className="app">
      {showAbout && <About setShowAbout={setShowAbout} />}
      <div className="normalContainer" style={{ opacity: showAbout ? 0.2 : 1 }}>
        <div className="graphRow">
          <button
            className="simToggle"
            onClick={simState === "running" ? stopRun : startRun}
            aria-label={simState === "running" ? "stop simulation" : "start simulation"}
          >
            {simState === "running" ? <StopIcon /> : <PlayIcon />}
          </button>
          <GraphCanvas
            boids={boidsNormal}
            canvasWidth={graphWidth}
            canvasHeight={graphHeight}
            id={"graphCanvas-normal"}
            addResetListener={addResetListener}
            addSimHistory={addSimHistory}
            notifySimDone={notifySimDone}
          />
        </div>
        <SwarmCounters
          boids={boidsNormal}
          showSimpleMenu={showSimpleMenu}
          setShowSimpleMenu={setShowSimpleMenu}
        />
        <div className="boidContainer">
          <div className="boidCanvasWrap" ref={canvasWrapRef}>
            <BirdCanvas
              id="boidsCanvas-normal"
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              opacity={showSimpleMenu ? 0.2 : 1}
            />
          </div>
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
              summary={summary}
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
            simState={simState}
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
            flockSizeMax={flockSizeMax}
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
