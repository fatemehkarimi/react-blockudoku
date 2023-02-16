import React from "react";
import { useSelector } from "react-redux";
import "./gameOver.scss";

function GameOver() {
  const score = useSelector((state) => state.score.score);
  return (
    <div className="game-over-wrapper">
      <div className="game-over-title">Game Over</div>
      <div className="game-over-final-score">Final score : {score} </div>
    </div>
  );
}

export default GameOver;
