import React, { useState, useEffect, useCallback } from "react";

import Boid from "./Boid";

import {
  calcSeparationHeading,
  calcAlignmentHeading,
  calcCohesionHeading,
  pointDistance
} from "./boidsUtils";

export default function Swarm({
  boidsCtx,
  canvasWidth,
  canvasHeight,
  boids,
  setBoids,
  resetCallback
}) {
  const [step, setStep] = useState(1);
  const [boidId, setBoidId] = useState(6);
  const [infectionRadius, setInfectionRadius] = useState(3);
  const [sdFactor, setSdFactor] = useState(0);
  const [isolationFactor, setIsolationFactor] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const clearCanvas = useCallback(() => {
    if (boidsCtx) {
      //boidsCtx.beginPath();
      boidsCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      //boidsCtx.closePath();
    }
  }, [canvasHeight, canvasWidth, boidsCtx]);

  const wrap = (val, min, max) => {
    if (val < min) {
      return max;
    } else if (val > max) {
      return min;
    } else {
      return val;
    }
  };

  const getNeighbors = useCallback(
    boid => {
      return boids.filter(neighbor => {
        // check if near boid
        return (
          pointDistance(
            { x: boid.x, y: boid.y },
            { x: neighbor.x, y: neighbor.y }
          ) <= boid.vision && boid.id !== neighbor.id
        );
      });
    },
    [boids]
  );

  const getBoidSpeed = () => {
    const max = 8;
    const min = 5;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const stepBoid = useCallback(
    boid => {
      // https://www.red3d.com/cwr/boids/
      // 1. separation - steer away from average position of neighbors
      // 2. alignment - steer toward average heading of neighbors
      // 3. cohesion - steer toward average position of neighbors

      //const infectionRadius = boid.radius * 2;

      // animFrameReq.current = requestAnimationFrame(stepBoid);

      const neighbors = getNeighbors(boid);

      let heading = boid.heading;
      let state = boid.state;

      if (neighbors && neighbors.length > 0) {
        const cohesionHeading = calcCohesionHeading(boid, neighbors);
        const alignmentHeading = calcAlignmentHeading(neighbors);
        const separationHeading = calcSeparationHeading(
          boid,
          neighbors,
          sdFactor
        );

        // check infection
        const infectedCloseNeighbors = neighbors.filter(neighbor => {
          return (
            pointDistance(boid, neighbor) < infectionRadius &&
            neighbor.state === "infected"
          );
        });

        if (infectedCloseNeighbors && infectedCloseNeighbors.length > 0) {
          state = "infected";
        }

        // change heading
        if (alignmentHeading !== null && cohesionHeading !== null) {
          // figure the target by averaging the cohesion, alignment, and separation
          let sumSin = Math.sin(cohesionHeading) + Math.sin(alignmentHeading);
          let sumCos = Math.cos(cohesionHeading) + Math.cos(alignmentHeading);
          let avgSin, avgCos;
          if (separationHeading !== null) {
            sumSin += Math.sin(separationHeading);
            sumCos += Math.cos(separationHeading);
            avgSin = sumSin / 3;
            avgCos = sumCos / 3;
          } else {
            avgSin = sumSin / 2;
            avgCos = sumCos / 2;
          }

          const target = Math.atan2(avgSin, avgCos);

          // account for radialSpeed. radialSpeed determines the biggest turn
          // a boid can make.
          // figure out the diff between target and current heading first
          let diff = Math.atan2(
            Math.sin(target - boid.heading),
            Math.cos(target - boid.heading)
          );
          // if diff is greater than radialSpeed use radialSpeed instead
          diff =
            Math.abs(diff) <= boid.radialSpeed
              ? diff
              : diff > 0
              ? boid.radialSpeed
              : -boid.radialSpeed;
          heading += diff;

          // make sure angle is in between -Math.PI <= x <= Math.PI
          heading = heading > Math.PI ? heading - 2 * Math.PI : heading;
          heading = heading < -Math.PI ? heading + 2 * Math.PI : heading;
        }
      }

      const newSpeed =
        boid.speed === 0
          ? boid.speed
          : Math.random() < 0.005
          ? getBoidSpeed()
          : boid.speed;

      return {
        ...boid,
        x: isPaused
          ? boid.x
          : wrap(boid.x + Math.cos(heading) * boid.speed, 0, canvasWidth),
        y: isPaused
          ? boid.y
          : wrap(boid.y + Math.sin(heading) * boid.speed, 0, canvasHeight),
        heading: isPaused ? boid.heading : heading,
        speed: newSpeed,
        state
      };
    },
    [
      canvasHeight,
      canvasWidth,
      getNeighbors,
      infectionRadius,
      isPaused,
      sdFactor
    ]
  );

  const handleStep = useCallback(() => {
    // step forward one iteration
    setStep(step => step + 1);
    // clearCanvas();
    setBoids(boids => {
      return boids.map(boid => {
        return stepBoid(boid);
      });
    });
  }, [stepBoid, setBoids]);

  const handleInfect = () => {
    const mobileBoids = boids.filter(b => b.speed > 0);
    const rndmIdx = Math.floor(Math.random() * mobileBoids.length);
    const boidToInfect = mobileBoids[rndmIdx];
    setBoids(
      boids.map(boid => {
        if (boidToInfect && boid.id === boidToInfect.id) {
          return {
            ...boid,
            state: "infected"
          };
        }
        return boid;
      })
    );
  };

  useEffect(() => {
    // isolation
    const factor = isolationFactor / 100;

    setBoids(boids => {
      return boids.map(b => {
        return { ...b, speed: Math.random() < factor ? 0 : getBoidSpeed() };
      });
    });
  }, [isolationFactor, setBoids]);

  const handleAddBunch = () => {
    const bunch = 50;
    const radius = 3;
    let newBoids = [];
    const isoFactor = isolationFactor / 100;

    for (let i = 0; i < bunch; i++) {
      newBoids.push({
        id: boidId + i,
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: radius,
        heading: Math.random() * 2 * Math.PI - Math.PI,
        speed: Math.random() < isoFactor ? 0 : getBoidSpeed(),
        vision: 35,
        radialSpeed: Math.PI / 21,
        state: "normal"
      });
    }
    setBoids(boids => boids.concat(newBoids));
    setBoidId(boidId => boidId + bunch);
  };

  useEffect(() => {
    // setup code here
    const intervalId = setInterval(() => {
      handleStep();
    }, 40);
    return () => {
      // teardown code here
      clearInterval(intervalId);
    };
  }, [handleStep]);

  const handleRandomClick = () => {
    if (boidsCtx) {
      clearCanvas();
    }
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
    const radius = 1;
    const isoFactor = isolationFactor / 100;

    setBoids([
      ...boids,
      {
        id: boidId,
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
    setBoidId(boidId + 1);
  };

  clearCanvas();

  return (
    <div className="swarmControl">
      {boids.map(boid => (
        <Boid
          key={boid.id}
          x={boid.x}
          y={boid.y}
          ctx={boidsCtx}
          radius={boid.radius}
          heading={boid.heading}
          color="red"
          state={boid.state}
          //vision={boid.vision}
        />
      ))}
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
      <div className="swarmButtonsContainer">
        <button onClick={handleRandomClick}>random</button>
        <button onClick={handleAddOne}>add one</button>
        <button onClick={handleAddBunch}>add bunch</button>
        <button onClick={handleStep}>step</button>
        <button onClick={handleInfect}>infect</button>
        <button
          onClick={e => {
            resetCallback();
            setBoids([]);
          }}
        >
          reset
        </button>
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "resume" : "pause"}
        </button>
      </div>
    </div>
  );
}
