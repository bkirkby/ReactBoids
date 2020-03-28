import React from "react";

export default function BirdCanvas(props) {
  return (
    <canvas
      width={props.canvasWidth}
      height={props.canvasHeight}
      style={{ backgroundColor: "black" }}
    />
  );
}
