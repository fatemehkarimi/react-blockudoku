import React from 'react';
import Row from '../row/row';
import UnitBoard from '../unit_board/unit_board';
import "./board.scss";
import appConfig from '../../config/config.json';

function Board() {
  const boardSize = appConfig["game"]["unit-board-size"];

  return (
    <div className="board">
      {
        [...Array(boardSize)].map(() => {
          return (
            <Row>
              {
                [...Array(boardSize)].map(() => <UnitBoard />)
              }
            </Row>
          );
        })
      }
    </div>
  );
}

export default Board;