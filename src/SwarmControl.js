import React from "react";

const SwarmControl = ({
  sdFactor,
  setSdFactor,
  isolationFactor,
  setIsolationFactor,
  flockSize,
  setFlockSize,
  flockSizeMax = 200,
  simState,
}) => {
  const disabled = simState == "running";

  return (
    <div className="swarmSliders">
      {disabled && (
        <div className="swarmLockOverlay">
          <span className="swarmLockLabel">
            <svg className="lockIcon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z" />
            </svg>
            locked while running
          </span>
        </div>
      )}
      <div className="sliderContainer">
        <div className="sliderLabel">
          <span>population:</span>
          <span>{flockSize}</span>
        </div>
        <input disabled={disabled} onChange={e => {
          e.preventDefault();
          setFlockSize(Number(e.target.value));
        }} id="popSlider" type="range" min="20" max={flockSizeMax} step="20" value={flockSize} />
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
