import React from "react";

const SwarmControl = ({
  sdFactor,
  setSdFactor,
  isolationFactor,
  setIsolationFactor
}) => {
  return (
    <div className="swarmSliders">
      <div className="sliderContainer">
        <div className="sliderLabel">
          <span>social distancing:</span>
          <span>{(sdFactor / 5).toFixed(1)} δ</span>
        </div>
        <input
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
        <input
          onChange={e => {
            e.preventDefault();
            setIsolationFactor(Number(e.target.value));
          }}
          id="isolationSlider"
          type="range"
          min="0"
          max="100"
          step="1"
          value={isolationFactor}
        />
      </div>
    </div>
  );
};

export default SwarmControl;
