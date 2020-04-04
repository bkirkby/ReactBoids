import React, { useEffect, useState } from "react";
import "./styles.css";

import BirdCanvas from "./BirdCanvas";
import GraphCanvas from "./GraphCanvas";
import Swarm from "./Swarm";

export default function App() {
  const [boidsCtx, setBoidsCtx] = useState();
  // const [boidsCtx2, setBoidsCtx2] = useState();
  const [canvasWidth] = useState(400);
  const [canvasHeight] = useState(300);
  const [boids, setBoids] = useState([]);
  // const [dispBuffer, setDispBuffer] = useState(1);

  useEffect(() => {
    const canvasOne = document.getElementById("boidsCanvas-one");
    setBoidsCtx(canvasOne.getContext("2d"));
    // const canvasTwo = document.getElementById("boidsCanvas-two");
    // setBoidsCtx2(canvasTwo.getContext("2d"));
  }, []);

  // const switchDisplayBuffer = useCallback(() => {
  //   setDispBuffer(dispBuffer => {
  //     return dispBuffer === 1 ? 2 : 1;
  //   });
  // }, [setDispBuffer]);

  // useEffect(() => {
  //   switchDisplayBuffer();
  // }, [boids, switchDisplayBuffer]);

  const zeroFill = num => {
    let ret = "";
    const maxLen = 4;
    for (let i = maxLen - ("" + num).length; i > 0; i--) {
      ret += "0";
    }
    return ret + num;
  };

  return (
    <div className="app">
      <GraphCanvas boids={boids} canvasWidth={canvasWidth} canvasHeight={50} />
      <div className="counters">
        <span className="normal">{zeroFill(boids.length)}</span>
        <span className="infected">
          {zeroFill(boids.filter(b => b.state === "infected").length)}
        </span>
      </div>
      <BirdCanvas
        id="boidsCanvas-one"
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
      />
      {/*<BirdCanvas
        id="boidsCanvas-two"
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        show={dispBuffer === 2 ? true : false}
      />*/}
      <Swarm
        boidsCtx={boidsCtx}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        boids={boids}
        setBoids={setBoids}
      />
    </div>
  );
}
