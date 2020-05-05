import React from "react";
import ReplayIcon from "@material-ui/icons/Replay";

const ReplayMenu = props => {
  return (
    <div className="replayMenu">
      <span style={{ width: "100%", textAlign: "center" }}>replay</span>
      <button style={{}}>
        <ReplayIcon style={{ fontSize: "128px" }} />
      </button>
    </div>
  );
};

export default ReplayMenu;
