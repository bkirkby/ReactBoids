import React, { useEffect } from "react";

// simple monotonic id generator for boids (unique per page session); ids are
// only used as React keys and for neighbor/self identity comparisons
let boidSeq = 0;
const nextBoidId = () => `boid-${boidSeq++}`;

export const generateNewBoid = () => {
  return {
    x: undefined,
    y: undefined,
    speed: undefined,
    infectedTime: undefined,
    id: nextBoidId(),
    radius: 2,
    heading: Math.random() * 2 * Math.PI - Math.PI,
    vision: 35,
    radialSpeed: Math.PI / 21,
    state: "normal"
  };
};

export const infectionStateColors = {
  normal: "#0033ff",
  infected: "#ffcc00",
  immune: "lightgreen",
  dead: "darkgrey"
};

export default function Boid({
  x,
  y,
  heading,
  radius,
  ctx,
  vision,
  state,
  timeStamp
}) {
  useEffect(() => {
    // draw to canvas
    if (ctx) {
      // nose destination
      const noseX = x + Math.cos(heading) * radius * 2.5;
      const noseY = y + Math.sin(heading) * radius * 2.5;
      // body and nose
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.fillStyle = infectionStateColors[state];
      ctx.strokeStyle = infectionStateColors[state];
      ctx.lineWidth = 2;

      ctx.beginPath();
      //circle and nose line
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.moveTo(x, y);
      ctx.lineTo(noseX, noseY);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      if (vision) {
        ctx.setLineDash([2, 2]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        //ctx.strokeStyle = "#66ff00";
        ctx.arc(x, y, vision, 0, 2 * Math.PI);
        // ctx.beginPath();
        // ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }, [x, y, radius, heading, state, ctx, vision, timeStamp]);

  return <></>;
}
