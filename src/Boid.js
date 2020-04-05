import React, { useEffect } from "react";

export default function Boid({
  x,
  y,
  heading,
  radius,
  color,
  ctx,
  vision,
  state
}) {
  const stateColors = {
    normal: "white",
    infected: "red",
    immune: "pink"
  };
  useEffect(() => {
    // draw to canvas
    if (ctx) {
      // nose destination
      const noseX = x + Math.cos(heading) * radius * 2.5;
      const noseY = y + Math.sin(heading) * radius * 2.5;
      // body and nose
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.71;
      ctx.fillStyle = stateColors[state];
      ctx.strokeStyle = stateColors[state];
      ctx.lineWidth = 1;

      ctx.beginPath();
      //circle and nose line
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.moveTo(x, y);
      ctx.lineTo(noseX, noseY);
      ctx.closePath();

      if (vision) {
        ctx.setLineDash([2, 2]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.strokeStyle = "#66ff00";
        ctx.arc(x, y, vision, 0, 2 * Math.PI);
        // ctx.beginPath();
        // ctx.arc(x, y, radius, 0, 2 * Math.PI);
        // ctx.stroke();
      }
      ctx.stroke();
      ctx.fill();
    }
  }, [x, y, radius, heading, state, stateColors, ctx, vision]);

  return <></>;
}
