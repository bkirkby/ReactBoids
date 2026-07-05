import React from "react";

import { createBunch, infectRandomBoid } from "./boidsUtils";

const SimpleMenu = ({
  setIsolationFactor,
  isolationFactor,
  setSdFactor,
  sdFactor,
  canvasWidth,
  canvasHeight,
  setBoids,
  setSimState,
  reset,
  setShowAbout,
  flockSize,
  setShowSimpleMenu,
  summary
}) => {
  const QUICK_ISO_FACTOR = 77;
  const QUICK_SD_FACTOR = 33; // 0 to 40
  const formatSDFactor = (sdFactor) => {
    return (sdFactor / 5).toFixed(1);
  }
  const handleUnconstrained = () => {
    reset();
    setIsolationFactor(0);
    setSdFactor(0);
    setSimState("running");
    const newBoids = createBunch(flockSize, 0, canvasWidth, canvasHeight);
    setBoids(infectRandomBoid(newBoids));
  };

  const handleIsolationConstrained = () => {
    const population = flockSize;
    reset();
    setSdFactor(0);
    setIsolationFactor(QUICK_ISO_FACTOR);
    setSimState("running");
    const newBoids = createBunch(
      population,
      QUICK_ISO_FACTOR,
      canvasWidth,
      canvasHeight
    );
    setBoids(infectRandomBoid(newBoids));
  };

  const handleSdConstrained = () => {
    const population = flockSize;
    reset();
    setSdFactor(QUICK_SD_FACTOR);
    setIsolationFactor(0);
    setSimState("running");
    const newBoids = createBunch(population, 0, canvasWidth, canvasHeight);
    setBoids(infectRandomBoid(newBoids));
  };

  const handleBothConstrained = () => {
    const population = flockSize;
    reset();
    setSdFactor(QUICK_SD_FACTOR);
    setIsolationFactor(QUICK_ISO_FACTOR);
    setSimState("running");
    const newBoids = createBunch(
      population,
      QUICK_ISO_FACTOR,
      canvasWidth,
      canvasHeight
    );
    setBoids(infectRandomBoid(newBoids));
  };

  const handleRegularRun = () => {
    reset();
    setSimState("running");
    const newBoids = createBunch(
      flockSize,
      isolationFactor,
      canvasWidth,
      canvasHeight
    );
    setBoids(infectRandomBoid(newBoids));
  }

  return (
    <div className="simpleMenu">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <span
          style={{
            color: "#ffcc00",
            backgroundColor: "#0033ff",
            alignSelf: "center",
            fontSize: "larger",
            width: "100%"
          }}
        >
          POPULATION: {flockSize}
        </span>
        <button
          onClick={() => {
            setShowSimpleMenu(false);
          }}
        >
          X
        </button>
      </div>
      <button onClick={handleUnconstrained}>unconstrained: sd:0.0 iso:0</button>
      <button onClick={handleSdConstrained}>sd constrained: sd:{formatSDFactor(QUICK_SD_FACTOR)} iso:0</button>
      <button onClick={handleIsolationConstrained}>
        iso constrained: sd:0.0 iso:{QUICK_ISO_FACTOR}
      </button>
      <button onClick={handleBothConstrained}>both constrained: sd:{formatSDFactor(QUICK_SD_FACTOR)} iso:{QUICK_ISO_FACTOR}</button>
      <button onClick={handleRegularRun} >
        fine tuned: sd:{formatSDFactor(sdFactor)} iso:{isolationFactor}
      </button>
      <button
        onClick={() => {
          setShowAbout(true);
        }}
      >
        about
      </button>
      {summary && (
        <div className="simSummary">
          <div className="simSummaryTitle">last run</div>
          <div className="simSummaryRow">
            <span>got sick:</span>
            <span>{summary.pctSick}% of population</span>
          </div>
          <div className="simSummaryRow">
            <span>ended:</span>
            <span>
              {summary.reason === "cleared"
                ? "no more infected"
                : "manually stopped"}
            </span>
          </div>
          <div className="simSummaryRow">
            <span>time to immunity:</span>
            <span>{(summary.durationMs / 1000).toFixed(1)}s</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMenu;
