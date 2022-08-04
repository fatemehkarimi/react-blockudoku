import React from 'react';
import Hole from '../../components/hole/hole';
import Board from '../../components/board/board';
import appConfig from '../../config/config.json';
import './gameBoard.scss';


function GameBoard(props, ref) {
  const size = appConfig["game"]["unit-board-size"];

  return (
    <div className='game-board-wrapper'>
      <Board ref={ ref } size={ size }>
        <Board className='game-board' size={ size }>
          <Hole className='game-board-hole' />
        </Board>
      </Board>
    </div>
  );
}

export default React.forwardRef(GameBoard);