import React from "react";

import { createBunch, infectBoid } from "./boidsUtils";

const SimpleMenu = ({
  setIsolationFactor,
  setSdFactor,
  canvasWidth,
  canvasHeight,
  setBoids,
  setSimState,
  reset
}) => {
  const handleUnconstrained = () => {
    reset();
    setIsolationFactor(0);
    setSdFactor(0);
    setSimState("running");
    const newBoids = createBunch(50, 0, canvasWidth, canvasHeight);
    setBoids(infectBoid(newBoids));
  };

  const handleIsolationConstrained = () => {
    const population = 50;
    const isolationFactor = 55;
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
    setBoids(infectBoid(newBoids));
  };

  const handleSdConstrained = () => {
    const population = 50;
    const sdFactor = 28; // 0 to 40
    reset();
    setSdFactor(sdFactor);
    setIsolationFactor(0);
    setSimState("running");
    const newBoids = createBunch(population, 0, canvasWidth, canvasHeight);
    setBoids(infectBoid(newBoids));
  };

  const handleBothConstrained = () => {
    const population = 50;
    const sdFactor = 28; // 0 to 40
    const isolationFactor = 55;
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
    setBoids(infectBoid(newBoids));
  };

  return (
    <div className="simpleMenu">
      <button onClick={handleUnconstrained}>unconstrained</button>
      <button onClick={handleSdConstrained}>social distance constrained</button>
      <button onClick={handleIsolationConstrained}>
        isolation constrained
      </button>
      <button onClick={handleBothConstrained}>both constrained</button>
      <button onClick={() => setSimState("freestyle")}>freestyle mode</button>
    </div>
  );
};

export default SimpleMenu;
