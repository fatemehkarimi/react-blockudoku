import React from 'react';
import Hole from '../../components/hole/hole';
import Board from '../../components/board/board';
import { EMPTY, FILLABLE, FILL } from '../../constants';
import './gameBoard.scss';


function getBoardMatrix(boardMatrix, boardIdx, boardSize) {
  var result = [];
  var row = Math.floor(boardIdx / boardSize);
  var col = boardIdx % boardSize;

  for(var i = 0; i < boardSize; ++i)
    for(var j = 0; j < boardSize; ++j) {
      var tmp_i = row * boardSize + i;
      var tmp_j = col * boardSize + j;
      result.push(boardMatrix[tmp_i][tmp_j]);
    }
  
  return result;
}


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
                    const matrix = getBoardMatrix(props.matrix, i, size);
                    const status = matrix[j];
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