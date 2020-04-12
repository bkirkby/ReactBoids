import React from "react";

const VerticalEllipses = ({
  height = 16,
  width = 16,
  color = "#ffcc00",
  radius = 1.5
}) => {
  const spacing = radius * 2.7;
  const yMid = height / 2;
  const yTop = yMid - spacing;
  const yBottom = yMid + spacing;
  return (
    <svg
      height={height}
      width={width}
      style={{
        height: { height },
        maxHeight: { height },
        border: "0px"
      }}
    >
      <circle cx={width / 2} cy={yTop} r={radius} fill={color} />
      <circle cx={width / 2} cy={yMid} r={radius} fill={color} />
      <circle cx={width / 2} cy={yBottom} r={radius} fill={color} />
    </svg>
  );
};

export default VerticalEllipses;
