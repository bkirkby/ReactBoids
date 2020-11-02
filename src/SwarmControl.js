import React from "react";

import {
  infectRandomBoid,
  createBunch,
  getBoidSpeed,
  BUNCH_SIZE
} from "./boidsUtils";
import { generateNewBoid } from "./Boid";

const SwarmControl = ({
  sdFactor,
  setSdFactor,
  isolationFactor,
  setIsolationFactor,
  flockSize,
  setFlockSize,
  simState,
}) => {
  const disabled = simState == "running";

  return (
    <div className="swarmSliders">
      <div className="sliderContainer">
        <div className="sliderLabel">
          <span>population:</span>
          <span>{flockSize}</span>
        </div>
        <input disabled={disabled} onChange={e => {
          e.preventDefault();
          setFlockSize(Number(e.target.value));
        }} id="popSlider" type="range" min="20" max="200" step="20" value={flockSize} />
      </div>
      <div className="sliderContainer">
        <div className="sliderLabel">
          <span>social distancing:</span>
          <span>{(sdFactor / 5).toFixed(1)} δ</span>
        </div>
        <input disabled={disabled}
          onChange={e => {
            e.preventDefault();
            setSdFactor(Number(e.target.value));
          }}
          id="sdSlider"
          type="range"
          min="0"
          max="40"
          step="1"
          value={sdFactor}
        />
      </div>
      <div className="sliderContainer">
        <div className="sliderLabel">
          <span>isolation: </span>
          <span>{isolationFactor}%</span>
        </div>
        <input disabled={disabled}
          onChange={e => {
            e.preventDefault();
            setIsolationFactor(Number(e.target.value));
          }}
          id="isolationSlider"
          type="range"
          min="0"
          max="100"
          step="5"
          value={isolationFactor}
        />
      </div>
    </div>
  );
};

export default SwarmControl;
