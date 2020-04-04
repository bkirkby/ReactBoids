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
  switchDisplayBuffer
}) {
  const [step, setStep] = useState(1);
  const [boidId, setBoidId] = useState(3);
  const [infectionRadius, setInfectionRadius] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const clearCanvas = useCallback(() => {
    if (boidsCtx) {
      boidsCtx.beginPath();
      boidsCtx.fillStyle = "red";
      boidsCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      boidsCtx.closePath();
    }
  }, [canvasHeight, canvasWidth, boidsCtx]);
  // const animFrameReq = useRef();

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
        const separationHeading = calcSeparationHeading(boid, neighbors);

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

      return {
        ...boid,
        x: isPaused
          ? boid.x
          : wrap(boid.x + Math.cos(heading) * boid.speed, 0, canvasWidth),
        y: isPaused
          ? boid.y
          : wrap(boid.y + Math.sin(heading) * boid.speed, 0, canvasHeight),
        heading: isPaused ? boid.heading : heading,
        state
      };
    },
    [canvasHeight, canvasWidth, getNeighbors, infectionRadius, isPaused]
  );

  const handleStep = useCallback(() => {
    // step forward one iteration
    setStep(step + 1);
    clearCanvas();
    setBoids(
      boids.map(boid => {
        return stepBoid(boid);
      })
    );
  }, [boids, clearCanvas, step, stepBoid, setBoids]);

  const handleInfect = () => {
    const rndmIdx = Math.floor(Math.random() * boids.length);
    setBoids(
      boids.map((boid, i) => {
        if (i === rndmIdx) {
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
    // setup code here
    const intervalId = setInterval(() => {
      handleStep();
    }, 40);
    //requestAnimationFrame(handleStep);
    return () => {
      // teardown code here
      clearInterval(intervalId);
      // cancelAnimationFrame(animFrameReq.current);
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

  const handleAddBunch = () => {
    const bunch = 50;
    const radius = 1;
    let newBoids = [];
    for (let i = 0; i < bunch; i++) {
      newBoids.push({
        id: boidId + i,
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: radius,
        heading: Math.random() * 2 * Math.PI - Math.PI,
        speed: Math.floor(Math.random() * (6 - 2 + 1) + 4),
        vision: 35,
        radialSpeed: Math.PI / 21,
        state: "normal"
      });
    }
    setBoids(boids.concat(newBoids));
    setBoidId(boidId + bunch);
  };

  const handleAddOne = () => {
    const radius = 1;
    setBoids([
      ...boids,
      {
        id: boidId,
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: radius,
        heading: Math.random() * 2 * Math.PI - Math.PI,
        speed: Math.floor(Math.random() * (6 - 2 + 1) + 3),
        vision: 35,
        radialSpeed: Math.PI / 15,
        state: "normal" // normal, infected, immune
      }
    ]);
    setBoidId(boidId + 1);
  };

  return (
    <>
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
      <div>
        <button onClick={handleRandomClick}>random</button>
        <button onClick={handleAddOne}>add one</button>
        <button onClick={handleAddBunch}>add bunch</button>
        <button onClick={handleStep}>step</button>
        <button onClick={handleInfect}>infect</button>
        <button onClick={() => setBoids([])}>reset</button>
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "resume" : "pause"}
        </button>
      </div>
    </>
  );
}
