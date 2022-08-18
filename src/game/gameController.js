import React, { useState } from 'react';
import { EMPTY, FILLABLE, FILL } from '../constants';
import { loadShapeDetails, getFirstFillable } from '../utils/utils';
import GameView from './gameView';
import appConfig from '../config/config.json';
import shapeDetails from '../data/shape_details.json';
import './gameController.scss';


function getRandomShape() {
  var idx = Math.floor(Math.random() * shapeDetails.length);
  return shapeDetails[idx];
}

function getRandomShapeList(size) {
  var result = [];

  for(var i = 0; i < size; ++i)
    result.push(getRandomShape());
  return result;
}

function getShapeListDetails(shapeList) {
  var result = [];
  for(var shape of shapeList)
    result.push(loadShapeDetails(shape));
  return result;
}

function createNewShapeListWithDetails(size) {
  var result = getRandomShapeList(size);
  result = getShapeListDetails(result);
  return result;
}

function fillBoard(boardMatrix, shape, i, j, status) {
  var result = [];
  for(var p = 0; p < boardMatrix.length; ++p)
    result[p] = boardMatrix[p].slice();

  const {row, column, matrix} = shape;
  for(var tmp_i = 0; tmp_i < row; ++tmp_i)
    for(var tmp_j = 0; tmp_j < column; ++tmp_j)
      if(matrix[tmp_i][tmp_j] == FILL)
        result[i + tmp_i][j + tmp_j] = status;
  
  return result;
}

function GameController() {
  const numShapesOnBoard = appConfig["game"]["num-shapes-on-board"];
  const boardSize = numShapesOnBoard ** 2;

  const [shapeList, setShapeList] = useState(
    createNewShapeListWithDetails(numShapesOnBoard));

  const [boardMatrix, setBoardMatrix] = useState(
    Array(boardSize).fill(
      Array(boardSize).fill(EMPTY)));

  const [matrixView, setMatrixView] = useState(boardMatrix);


  const isFillableOnBoard = (board_i, board_j, shapeDetails) => {
    const { row, column, matrix } = shapeDetails;
    var canBeFilled = true;
    for(var i = 0; i < row; ++i)
      for(var j = 0; j < column; ++j)
        if(matrix[i][j] == FILL) {
            var tmp_i = board_i + i;
            var tmp_j = board_j + j;

            if(tmp_i >=0 && tmp_i < boardSize
              && tmp_j >= 0 && tmp_j < boardSize) {
              if(boardMatrix[tmp_i][tmp_j] == FILL)
                canBeFilled = false;
            }
            else
              canBeFilled = false;

            if(!canBeFilled)
              break;
        }
    return canBeFilled;
  }

  const checkFillPossible = (board_i, board_j, shapeId) => {
    var canBeFilled;
    if(board_i == null || board_j == null || shapeId == null)
      canBeFilled = false;
    else
      canBeFilled = isFillableOnBoard(board_i, board_j, shapeList[shapeId]);
      
    if(canBeFilled) {
      var tmpMatrix = fillBoard(
        boardMatrix, shapeList[shapeId], board_i, board_j, FILLABLE);
      setMatrixView(tmpMatrix);
    }
    else
      setMatrixView(boardMatrix);
  }

  const dropShape = (board_i, board_j, shapeId) => {
    var canBeFilled;
    if(board_i == null || board_j == null || shapeId == null)
      canBeFilled = false;
    else
      canBeFilled = isFillableOnBoard(board_i, board_j, shapeList[shapeId]);

    if(canBeFilled) {
      var tmpMatrix = fillBoard(
        boardMatrix, shapeList[shapeId], board_i, board_j, FILL);
      setBoardMatrix(tmpMatrix);
      setMatrixView(tmpMatrix);
    }
    else
      setMatrixView(boardMatrix);
  }

  return (
    <div>
      <GameView
        matrix={ matrixView }
        shapeList={ shapeList }
        checkFillPossible={ checkFillPossible }
        notifyDrop={ dropShape } />
    </div>
  );
}

export default GameController;