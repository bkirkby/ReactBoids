import React from "react";

import { createBunch, infectBoid } from "./boidsUtils";

const SimpleMenu = ({
  isolationFactor,
  canvasWidth,
  canvasHeight,
  setBoids,
  setSimState,
  reset
}) => {
  const handleUnconstrained = () => {
    reset();
    setSimState("running");
    const newBoids = createBunch(50, 0, canvasWidth, canvasHeight);
    setBoids(infectBoid(newBoids));
  };

  return (
    <div className="simpleMenu">
      <button onClick={handleUnconstrained}>unconstrained</button>
      <button>social distance constrained</button>
      <button>isolation constrained</button>
      <button>both constrained</button>
      <button>freestyle mode</button>
    </div>
  );
};

export default SimpleMenu;
