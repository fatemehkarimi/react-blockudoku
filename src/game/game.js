import React from 'react';
import Hole from '../components/hole/hole';
import Board from '../components/board/board';
import appConfig from '../config/config.json';
import './game.scss';


function GameBoard({ size }) {
  return (
    <div className='game-board-wrapper'>
      <Board size={ size }>
        <Board className='game-board' size={ size }>
          <Hole />
        </Board>
      </Board>
    </div>
  );
}


function Game() {
  const boardSize = appConfig["game"]["unit-board-size"];

  return (
    <div className='game-wrapper'>
      <GameBoard size={ boardSize } />
    </div>
  );
}

export default Game;