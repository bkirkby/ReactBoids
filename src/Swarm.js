import React, { useState, useEffect, useCallback } from "react";

import Boid from "./Boid";

import {
  calcSeparationHeading,
  calcAlignmentHeading,
  calcCohesionHeading,
  pointDistance
} from "./boidsUtils";

export default function Swarm({ ctx, canvasWidth, canvasHeight }) {
  const [step, setStep] = useState(1);
  const [boidId, setBoidId] = useState(3);
  const [boids, setBoids] = useState([
    // {
    //   id: 0,
    //   x: 20,
    //   y: 100,
    //   radius: 3,
    //   color: "red",
    //   heading: 0,
    //   speed: 3,
    //   vision: 60,
    //   radialSpeed: Math.PI / 9
    // },
    // {
    //   id: 1,
    //   x: 60,
    //   y: 100,
    //   radius: 3,
    //   color: "red",
    //   heading: Math.PI,
    //   speed: 3,
    //   vision: 60,
    //   radialSpeed: Math.PI / 9
    // },
    // {
    //   id: 2,
    //   x: 40,
    //   y: 50,
    //   radius: 3,
    //   color: "red",
    //   heading: Math.PI,
    //   speed: 3,
    //   vision: 60,
    //   radialSpeed: Math.PI / 9
    // }
  ]);
  const clearCanvas = useCallback(() => {
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.closePath();
    }
  }, [canvasHeight, canvasWidth, ctx]);

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
        // const distance = Math.sqrt(
        //   Math.exp(Math.abs(neighbor.x - boid.x), 2) +
        //     Math.exp(Math.abs(neighbor.y - boid.y), 2)
        // );
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

      const neighbors = getNeighbors(boid);

      let heading = boid.heading;

      if (neighbors && neighbors.length > 0) {
        const cohesionHeading = calcCohesionHeading(boid, neighbors);
        const alignmentHeading = calcAlignmentHeading(neighbors);
        const separationHeading = calcSeparationHeading(boid, neighbors);

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
        x: wrap(boid.x + Math.cos(heading) * boid.speed, 0, canvasWidth),
        y: wrap(boid.y + Math.sin(heading) * boid.speed, 0, canvasHeight),
        heading
      };
    },
    [canvasHeight, canvasWidth, getNeighbors]
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
  }, [boids, clearCanvas, step, stepBoid]);

  useEffect(() => {
    // setup code here
    const intervalId = setInterval(() => {
      handleStep();
    }, 60);
    return () => {
      // teardown code here
      clearInterval(intervalId);
    };
  }, [clearCanvas, handleStep]);

  const handleRandomClick = () => {
    if (ctx) {
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
    const radius = 3;
    setBoids([
      ...boids,
      {
        id: boidId,
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: radius,
        color: "red",
        heading: Math.random() * 2 * Math.PI - Math.PI,
        speed: Math.random() * 5 + 3,
        vision: 50,
        radialSpeed: Math.PI / 15
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
          ctx={ctx}
          radius={boid.radius}
          heading={boid.heading}
          color="red"
          //vision={boid.vision}
        />
      ))}
      <div>
        <button onClick={handleRandomClick}>random</button>
        <button onClick={handleAddOne}>add one</button>
        <button onClick={handleStep}>step</button>
      </div>
    </>
  );
}
