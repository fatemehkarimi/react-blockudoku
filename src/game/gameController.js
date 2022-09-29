import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EMPTY, FILLABLE, FILL } from '../constants';
import { loadShapeDetails, getFirstFillable } from '../utils/utils';
import { fillBoard, setBoardView } from '../features/scoring/scoringSlice';
import GameView from './gameView';
import appConfig from '../config/config.json';
import shapeDetails from '../data/shape_details.json';


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

function GameController() {
  const numShapesOnBoard = appConfig["game"]["num-shapes-on-board"];
  const dispatch = useDispatch();
  const board = useSelector((state) => state.score.board);
  const boardView = useSelector((state) => state.score.boardView);
  const [shapeList, setShapeList] = useState(
    createNewShapeListWithDetails(numShapesOnBoard));

  const handleFillBoardView = (i, j, shape_id) => {
    if(i == null || j == null || shape_id == null)
      return;

    dispatch(setBoardView({
      newBoard: board
    }));

    dispatch(fillBoard({
      board: 'view',
      i,
      j,
      shape: getShapeById(shapeList, shape_id),
      status: FILLABLE
    }));
  }

  const dropShape = (i, j, shapeId) => {
    if(i == null || j == null || shapeId == null)
      return;

    dispatch(fillBoard({
      board: 'main',
      i,
      j,
      shape: getShapeById(shapeList, shapeId),
      status: FILL
    }));

    var newShapeList = removeShapeFromShapeList(shapeList, shapeId);
    if(newShapeList.length == 0)
      var newShapeList = createNewShapeListWithDetails(numShapesOnBoard);
    setShapeList(newShapeList);
  }

  useEffect(() => {
    dispatch(setBoardView({
      newBoard: board
    }));
  }, [board]);

  return (
    <div>
      <GameView
        matrix={ boardView }
        checkFillPossible={ handleFillBoardView }
        shapeList={ shapeList }
        notifyDrop={ dropShape } />
    </div>
  );
}

export default GameController;