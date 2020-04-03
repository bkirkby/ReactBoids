import React, { useEffect, useState, useCallback } from "react";
import "./styles.css";

import BirdCanvas from "./BirdCanvas";
import GraphCanvas from "./GraphCanvas";
import Swarm from "./Swarm";

export default function App() {
  const [boidsCtx1, setBoidsCtx1] = useState();
  const [boidsCtx2, setBoidsCtx2] = useState();
  const [canvasWidth] = useState(1024);
  const [canvasHeight] = useState(768);
  const [boids, setBoids] = useState([]);
  const [dispBuffer, setDispBuffer] = useState(1);

  useEffect(() => {
    const canvasOne = document.getElementById("boidsCanvas-one");
    setBoidsCtx1(canvasOne.getContext("2d"));
    const canvasTwo = document.getElementById("boidsCanvas-two");
    setBoidsCtx2(canvasTwo.getContext("2d"));
  }, []);

  const switchDisplayBuffer = useCallback(() => {
    setDispBuffer(dispBuffer => {
      console.log(
        "bk: App.js: App: switchDisplayBuffer: setDispBuffer: dispBuffer: ",
        dispBuffer
      );
      return dispBuffer === 1 ? 2 : 1;
    });
  }, [setDispBuffer]);

  useEffect(() => {
    switchDisplayBuffer();
  }, [boids, switchDisplayBuffer]);

  return (
    <>
      <GraphCanvas canvasWidth={canvasWidth} canvasHeight={25} />
      <BirdCanvas
        id="boidsCanvas-one"
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        show={dispBuffer === 1 ? true : false}
      />
      <BirdCanvas
        id="boidsCanvas-two"
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        show={dispBuffer === 2 ? true : false}
      />
      <Swarm
        boidsCtx={dispBuffer === 1 ? boidsCtx2 : boidsCtx1}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        boids={boids}
        setBoids={setBoids}
      />
    </>
  );
}
