import React from "react";
import { useSelector } from "react-redux";
import "./scoreboard.scss";

function Scoreboard() {
  const score = useSelector((state) => state.score.score);
  return (
    <div className="scoreboard-wrapper">
      <div className="scoreboard-score-pair">
        <span className="scoreboard-score-title">Score: </span>
        <span className="scoreboard-score-value">{score}</span>
      </div>
    </div>
  );
}

export default Scoreboard;