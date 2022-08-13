import React from 'react';
import Hole from '../../components/hole/hole';
import Board from '../../components/board/board';
import { EMPTY, FILLABLE, FILL } from '../../constants';
import './gameBoard.scss';


function GameBoard(props, ref) {
  const size = Math.sqrt(props.matrix.length);

  return (
    <div className='game-board-wrapper'>
      <Board ref={ ref } size={ size }>
        {
          [...Array(size ** 2).keys()].map((i) => {
            return (
              <Board key={ i } size={ size }>
                {
                  [...Array(size ** 2).keys()].map((j) => {
                    const status = props.matrix[i][j];
                    var statusStyle = '';

                    if(status == EMPTY)
                      statusStyle = 'board-empty-hole';
                    else if(status == FILL)
                      statusStyle = 'board-fill-hole';
                    else
                      statusStyle = 'board-fillable-hole';

                    return <Hole
                            key={ j }
                            className={ statusStyle } />
                  })
                }
              </Board>
            )
          })
        }
      </Board>
    </div>
  );
}

export default React.forwardRef(GameBoard);