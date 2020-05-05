import React from "react";

import VerticalEllipses from "./components/svgs/VerticalEllipses";

const SwarmCounters = ({ boids, showSimpleMenu, setShowSimpleMenu }) => {
  const zeroFill = num => {
    let ret = "";
    const maxLen = 4;
    for (let i = maxLen - ("" + num).length; i > 0; i--) {
      ret += "0";
    }
    return ret + num;
  };

  return (
    <div className="countersContainer">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around"
        }}
      >
        <div
          style={{
            marginLeft: "10px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div className="normalText">healthy</div>
          <span className="normalText">
            {zeroFill(boids.filter(b => b.state === "normal").length)}
          </span>
        </div>
        <div
          style={{
            marginLeft: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div className="infectedText">infected</div>
          <span className="infectedText">
            {zeroFill(boids.filter(b => b.state === "infected").length)}
          </span>
        </div>
        <div
          style={{
            marginLeft: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div className="immuneText">immune</div>
          <span className="immuneText">
            {zeroFill(boids.filter(b => b.state === "immune").length)}
          </span>
        </div>
        {/* <div
          style={{
            marginLeft: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div className="deadText">dead</div>
          <span className="deadText">
            {zeroFill(boids.filter(b => b.state === "dead").length)}
          </span>
        </div> */}
      </div>

      <button
        id="menuButton"
        style={{
          borderStyle: showSimpleMenu ? "inset" : "outset",
          padding: "0px",
          maxHeight: "auto"
        }}
        onClick={() => setShowSimpleMenu(!showSimpleMenu)}
      >
        <VerticalEllipses />
      </button>
    </div>
  );
};

export default SwarmCounters;
