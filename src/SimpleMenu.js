import React from "react";

import { createBunch, infectRandomBoid } from "./boidsUtils";
import { pageView } from "./googleAnalytics";

const SimpleMenu = ({
  setIsolationFactor,
  setSdFactor,
  canvasWidth,
  canvasHeight,
  setBoids,
  setSimState,
  reset,
  setShowAbout,
  flockSize,
  setFlockSize,
  setShowSimpleMenu
}) => {
  const handleUnconstrained = () => {
    reset();
    setIsolationFactor(0);
    setSdFactor(0);
    setSimState("running");
    const newBoids = createBunch(flockSize, 0, canvasWidth, canvasHeight);
    setBoids(infectRandomBoid(newBoids));
    pageView("/unconstrained");
  };

  const handleIsolationConstrained = () => {
    const population = flockSize;
    const isolationFactor = 77;
    reset();
    setSdFactor(0);
    setIsolationFactor(isolationFactor);
    setSimState("running");
    const newBoids = createBunch(
      population,
      isolationFactor,
      canvasWidth,
      canvasHeight
    );
    setBoids(infectRandomBoid(newBoids));
    pageView("/isolationConstrained");
  };

  const handleSdConstrained = () => {
    const population = flockSize;
    const sdFactor = 33; // 0 to 40
    reset();
    setSdFactor(sdFactor);
    setIsolationFactor(0);
    setSimState("running");
    const newBoids = createBunch(population, 0, canvasWidth, canvasHeight);
    setBoids(infectRandomBoid(newBoids));
    pageView("/sdConstrained");
  };

  const handleBothConstrained = () => {
    const population = flockSize;
    const sdFactor = 33; // 0 to 40
    const isolationFactor = 77;
    reset();
    setSdFactor(sdFactor);
    setIsolationFactor(isolationFactor);
    setSimState("running");
    const newBoids = createBunch(
      population,
      isolationFactor,
      canvasWidth,
      canvasHeight
    );
    setBoids(infectRandomBoid(newBoids));
    pageView("/bothConstrained");
  };

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
          INFECTION SIMULATOR
        </span>
        <button
          onClick={() => {
            setShowSimpleMenu(false);
          }}
        >
          X
        </button>
      </div>
      <button onClick={handleUnconstrained}>unconstrained</button>
      <button onClick={handleSdConstrained}>social distance constrained</button>
      <button onClick={handleIsolationConstrained}>
        isolation constrained
      </button>
      <button onClick={handleBothConstrained}>both constrained</button>
      <button
        onClick={() => {
          // toggleFreeStyleMode();
          // pageView(`/freestyle/${!freeStyleMode}`);
          setFlockSize(200);
        }}
      >
        freestyle mode
      </button>
      <button
        onClick={() => {
          setShowAbout(true);
          pageView("/about");
        }}
      >
        about
      </button>
    </div>
  );
};

export default SimpleMenu;
