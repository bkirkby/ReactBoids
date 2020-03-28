import React, { useState, useEffect, useCallback } from "react";

import Boid from "./Boid";

export default function Swarm({ ctx, canvasWidth, canvasHeight }) {
  const [step, setStep] = useState(1);
  const [boidId, setBoidId] = useState(2);
  const [boids, setBoids] = useState([
    {
      id: 0,
      x: 20,
      y: 100,
      radius: 3,
      color: "red",
      heading: 0,
      speed: 3,
      vision: 40,
      radialSpeed: Math.PI / 15
    },
    {
      id: 1,
      x: 60,
      y: 100,
      radius: 3,
      color: "red",
      heading: Math.PI,
      speed: 3,
      vision: 40,
      radialSpeed: Math.PI / 15
    }
  ]);
  const clearCanvas = useCallback(() => {
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.closePath();
    }
  }, [canvasHeight, canvasWidth, ctx]);

  useEffect(() => {
    // setup code here
    return () => {
      // teardown code here
    };
  }, [clearCanvas]);

  const wrap = (val, min, max) => {
    if (val < min) {
      return max;
    } else if (val > max) {
      return min;
    } else {
      return val;
    }
  };

  // const bounceX = (val, heading, min, max) => {
  //   if (val < 0 ) {

  //   }
  // }

  const pointDistance = (p1, p2) => {
    return Math.sqrt(
      Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2)
    );
  };

  const getNeighbors = boid => {
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
  };

  const flipAngle = angle => {
    if (angle > Math.PI || angle < -Math.PI) {
      console.error("invalid radian angle to flipAngle: angle: ", angle);
      throw Error("invalid radian angle to flipAngle");
    }
    return angle - Math.PI < -Math.PI ? angle + Math.PI : angle - Math.PI;
  };

  const clamp = (value, limit) => {
    return Math.min(limit, Math.max(-limit, value));
  };

  const stepBoid = boid => {
    // https://www.red3d.com/cwr/boids/
    // 1. separation - steer away from average position of neighbors
    // 2. alignment - steer toward average heading of neighbors
    // 3. cohesion - steer toward average position of neighbors

    // separation and cohesion are in conflict so need to
    // have different strengths of each

    // move boid basedon laws of sin and cosine
    // heading is in radians (or neg radians)
    // so cos(angle) = opposite over hypotenuse
    // sin(angle) = adjacent over hypotenuse
    const neighbors = getNeighbors(boid);

    let heading = boid.heading;
    neighbors.forEach(neighbor => {
      // check for collision
      const distance = pointDistance(
        { x: boid.x, y: boid.y },
        { x: neighbor.x, y: neighbor.y }
      );
      if (distance <= boid.radius * 2) {
        console.log("Swarm.js: stepBoid: collision detected: boid: ", boid);
        console.log(
          "Swarm.js: stepBoid: collision detected: neighbor: ",
          neighbor
        );
        var delta = Math.atan2(boid.y - neighbor.y, boid.x - neighbor.x);
        delta = clamp(delta, boid.radialSpeed);
        heading = boid.heading + delta;
      }
    });

    return {
      ...boid,
      x: wrap(boid.x + Math.cos(heading) * boid.speed, 0, canvasWidth),
      y: wrap(boid.y + Math.sin(heading) * boid.speed, 0, canvasHeight),
      heading
    };
  };

  const handleStep = () => {
    // step forward one iteration
    setStep(step + 1);
    clearCanvas();
    setBoids(
      boids.map(boid => {
        return stepBoid(boid);
      })
    );
  };

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
    const radius = 5;
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
        vision: 30,
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
