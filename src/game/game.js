import React from 'react';
import Hole from '../components/hole/hole';
import Board from '../components/board/board';
import Shape from '../components/shape/shape';
import { loadShapeDetails } from '../utils/utils';
import appConfig from '../config/config.json';
import shapeDetails from '../data/shape_details.json';
import './game.scss';


function GameBoard({ size }) {
  return (
    <div className='game-board-wrapper'>
      <Board size={ size }>
        <Board className='game-board' size={ size }>
          <Hole className='game-board-hole' />
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
      <div>
        <Shape details={ loadShapeDetails(shapeDetails[10]) } />
      </div>
    </div>
  );
}

export default Game;