import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const generateNewBoid = () => {
  return {
    x: undefined,
    y: undefined,
    speed: undefined,
    infectedTime: undefined,
    id: uuidv4(),
    radius: 2,
    heading: Math.random() * 2 * Math.PI - Math.PI,
    vision: 35,
    radialSpeed: Math.PI / 21,
    state: "normal"
  };
};

export default function Boid({ x, y, heading, radius, ctx, vision, state }) {
  const stateColors = {
    normal: "#0033ff",
    infected: "#ffcc00",
    immune: "lightgreen",
    dead: "darkgrey"
  };
  useEffect(() => {
    // draw to canvas
    if (ctx) {
      // nose destination
      const noseX = x + Math.cos(heading) * radius * 2.5;
      const noseY = y + Math.sin(heading) * radius * 2.5;
      // body and nose
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.fillStyle = stateColors[state];
      ctx.strokeStyle = stateColors[state];
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
  }, [x, y, radius, heading, state, stateColors, ctx, vision]);

  return <></>;
}
