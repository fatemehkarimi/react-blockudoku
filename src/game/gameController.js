import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FILLABLE, FILL } from '../constants';
import { loadShapeDetails, isBoardEquals } from '../utils/utils';
import {
  fillBoardWithShape,
  setBoard,
  setBoardView, 
  addScore} from '../features/scoring/scoringSlice';
import GameView from './gameView';
import appConfig from '../config/config.json';
import shapeDetails from '../data/shape_details.json';
import { ScoreCalculator } from './scoreCalculator';

const boardSize = appConfig["game"]["unit-board-size"] ** 2;
const dropScore = appConfig["score"]["drop-score"];

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

  for(var i = 0; i < size; ++i)
    result[i]["id"] = i;

  return result;
}

function removeShapeFromShapeList(shapeList, shapeId) {
  var result = [];
  for(var shape of shapeList)
    if(shape["id"] != shapeId)
      result.push(shape);
  return result;
}

function getShapeById(shapeList, shapeId) {
  for(var shape of shapeList)
    if(shape["id"] == shapeId)
      return shape;
}

function isFillableOnBoard(board, board_i, board_j, shapeDetails) {
  const { row, column, matrix: shape } = shapeDetails;
  var canBeFilled = true;
  for(var i = 0; i < row; ++i)
    for(var j = 0; j < column; ++j)
      if(shape[i][j] == FILL) {
          var tmp_i = board_i + i;
          var tmp_j = board_j + j;

          if(tmp_i >= 0 && tmp_i < boardSize
            && tmp_j >= 0 && tmp_j < boardSize) {
            if(board[tmp_i][tmp_j] == FILL)
              canBeFilled = false;
          }
          else
            canBeFilled = false;

          if(!canBeFilled)
            break;
      }
  return canBeFilled;
}

function GameController() {
  const numShapesOnBoard = appConfig["game"]["num-shapes-on-board"];
  const dispatch = useDispatch();
  const board = useSelector((state) => state.score.board);
  const boardView = useSelector((state) => state.score.boardView);
  const [shapeList, setShapeList] = useState(
    createNewShapeListWithDetails(numShapesOnBoard));

  const handleFillBoardView = (i, j, shapeId) => {
    if(i == null || j == null || shapeId == null)
      return;

    dispatch(setBoardView({
      newBoard: board
    }));

    if(!isFillableOnBoard(boardView, i, j, getShapeById(shapeList, shapeId)))
      return;

    dispatch(fillBoardWithShape({
      board: 'view',
      i,
      j,
      shape: getShapeById(shapeList, shapeId),
      status: FILLABLE
    }));
  }

  const dropShape = (i, j, shapeId) => {
    if(i == null || j == null || shapeId == null)
      return;

    if(!isFillableOnBoard(board, i, j, getShapeById(shapeList, shapeId)))
      return;

    dispatch(fillBoardWithShape({
      board: 'main',
      i,
      j,
      shape: getShapeById(shapeList, shapeId),
      status: FILL
    }));

    dispatch(addScore({score: dropScore}));

    var newShapeList = removeShapeFromShapeList(shapeList, shapeId);
    if(newShapeList.length == 0)
      var newShapeList = createNewShapeListWithDetails(numShapesOnBoard);
    setShapeList(newShapeList);
  }

  useEffect(() => {
    dispatch(setBoardView({
      newBoard: board
    }));

    const scoreCalculator = new ScoreCalculator(board);
    const newScore = scoreCalculator.calcScore();
    const newBoard = scoreCalculator.getNewBoard();

    dispatch(addScore({score: newScore}));
    if(!isBoardEquals(board, newBoard))
      dispatch(setBoard({newBoard: newBoard}));
  }, [board]);

  return (
    <GameView
      matrix={ boardView }
      checkFillPossible={ handleFillBoardView }
      shapeList={ shapeList }
      notifyDrop={ dropShape } />
  );
}

export default GameController;