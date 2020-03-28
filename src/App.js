import React, { useEffect, useState } from "react";
import "./styles.css";

import BirdCanvas from "./BirdCanvas";
import Swarm from "./Swarm";

export default function App() {
  const [ctx, setCtx] = useState();
  const [canvasWidth] = useState(400);
  const [canvasHeight] = useState(300);

  useEffect(() => {
    const canvas = document.getElementsByTagName("canvas");
    setCtx(canvas[0].getContext("2d"));
  }, []);

  return (
    <>
      <BirdCanvas canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
      <Swarm ctx={ctx} canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
    </>
  );
}
