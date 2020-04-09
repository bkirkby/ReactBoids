import { v4 as uuidv4 } from "uuid";

export const pointDistance = (p1, p2) => {
  return Math.sqrt(
    Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2)
  );
};

export const calcAlignmentHeading = neighbors => {
  if (!neighbors || neighbors.length <= 0) {
    return null;
  }

  let avgHeading = neighbors
    .map(neighbor => neighbor.heading)
    .reduce((accumulator, neighborHeading) => accumulator + neighborHeading);
  avgHeading = avgHeading / neighbors.length;

  return avgHeading;
};

export const calcCohesionHeading = (boid, neighbors) => {
  if (!neighbors || neighbors.length <= 0) {
    return null;
  }

  let avgPosition = neighbors.reduce((accumulator, neighbor) => {
    return { x: accumulator.x + neighbor.x, y: accumulator.y + neighbor.y };
  });

  avgPosition = {
    x: avgPosition.x / neighbors.length,
    y: avgPosition.y / neighbors.length
  };

  return Math.atan2(avgPosition.y - boid.y, avgPosition.x - boid.x);
};

export const calcSeparationHeading = (boid, neighbors, separationRadius) => {
  //const separationRadius = 15; //0,10,20,30,40
  if (!neighbors || neighbors.length <= 0) {
    return null;
  }
  // only separate from really close neighbors,
  // i.e. those that are within 2x radius of the boid

  const closeNeighbors = neighbors.filter(neighbor => {
    return pointDistance(boid, neighbor) < separationRadius;
  });

  if (closeNeighbors.length <= 0) {
    return null;
  }

  // get avg angle of close neighbors
  let avgPosition = closeNeighbors.reduce((accumulator, closeNeighbor) => {
    return {
      x: accumulator.x + closeNeighbor.x,
      y: accumulator.y + closeNeighbor.y
    };
  });

  avgPosition = {
    x: avgPosition.x / closeNeighbors.length,
    y: avgPosition.y / closeNeighbors.length
  };

  let heading =
    Math.atan2(avgPosition.y - boid.y, avgPosition.x - boid.x) + Math.PI;
  //make sure heading is between -Math.PI <= heading <= Math.PI
  heading = heading > Math.PI ? heading - 2 * Math.PI : heading;
  heading = heading < -Math.PI ? heading + 2 * Math.PI : heading;
  return heading;
};

export const getBoidSpeed = () => {
  const max = 8;
  const min = 5;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const createBunch = (
  bunchNumber,
  isolationFactor,
  canvasWidth,
  canvasHeight
) => {
  const radius = 2;
  let newBoids = [];
  const isoFactor = isolationFactor / 100;

  for (let i = 0; i < bunchNumber; i++) {
    newBoids.push({
      id: uuidv4(),
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
  return newBoids;
};

export const infectBoid = boids => {
  const mobileAndHealthyBoids = boids.filter(
    b => b.speed > 0 && b.state === "normal"
  );
  const rndmIdx = Math.floor(Math.random() * mobileAndHealthyBoids.length);
  const boidToInfect = mobileAndHealthyBoids[rndmIdx];
  return boids.map(boid => {
    if (boidToInfect && boid.id === boidToInfect.id) {
      return {
        ...boid,
        state: "infected"
      };
    }
    return boid;
  });
};
