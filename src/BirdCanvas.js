import React from "react";

export default function BirdCanvas(props) {
  return (
    <canvas
      id={props.id}
      width={props.canvasWidth}
      height={props.canvasHeight}
      style={{
        backgroundColor: "black",
        flexBasis: props.canvasWidth + "px",
        maxHeight: props.canvasHeight,
        opacity: props.opacity
      }}
    />
  );
}
