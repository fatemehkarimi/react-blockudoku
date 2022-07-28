import React from 'react';
import Row from '../row/row';
import Hole from '../hole/hole';

import './unit_board.scss';

import appConfig from '../../config/config.json';


function UnitBoard() {
  const boardSize = appConfig["game"]["unit-board-size"];

  return (
    <div className='unit-board-wrapper'>
      {
        [...Array(boardSize)].map(() => {
          return (
            <Row>
              {
                [...Array(boardSize)].map(() => <Hole />)
              }
            </Row>
          );
        })
      }
    </div>
  );
}

export default UnitBoard;