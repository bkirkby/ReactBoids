import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { infectBoid, createBunch, getBoidSpeed } from "./boidsUtils";

const SwarmControl = ({
  sdFactor,
  setSdFactor,
  isolationFactor,
  setIsolationFactor,
  setBoids,
  boids,
  canvasWidth,
  canvasHeight,
  reset,
  isPaused,
  setIsPaused,
  simState
}) => {
  const handleInfect = () => {
    setBoids(infectBoid(boids));
  };

  const handleAddBunch = () => {
    const newBoids = createBunch(
      50,
      isolationFactor,
      canvasWidth,
      canvasHeight
    );
    setBoids(boids => boids.concat(newBoids));
  };

  const handleRandomClick = () => {
    // if (boidsCtx) {
    //   clearCanvas();
    // }
    setBoids(
      boids.map(boid => {
        return {
          ...boid,
          x: Math.random() * (canvasWidth - 0) + 0,
          y: Math.random() * (canvasHeight - 0) + 0,
          heading: Math.random() * 2 * Math.PI - Math.PI
        };
      })
    );
  };

  const handleAddOne = () => {
    const radius = 2;
    const isoFactor = isolationFactor / 100;

    setBoids([
      ...boids,
      {
        id: uuidv4(),
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: radius,
        heading: Math.random() * 2 * Math.PI - Math.PI,
        speed: Math.random() < isoFactor ? 0 : getBoidSpeed(),
        vision: 35,
        radialSpeed: Math.PI / 16,
        state: "normal" // normal, infected, immune
      }
    ]);
  };

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
      {simState === "freestyle" && (
        <div className="swarmButtonsContainer">
          <button onClick={handleAddBunch}>add bunch</button>
          <button onClick={handleAddOne}>add one</button>
          <button onClick={handleRandomClick}>random</button>
          <button onClick={handleInfect}>infect</button>
          <button onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? "resume" : "pause"}
          </button>
          <button
            onClick={e => {
              reset();
              setBoids([]);
            }}
          >
            reset
          </button>
        </div>
      )}
    </div>
  );
};

export default SwarmControl;
