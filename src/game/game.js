import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import { useComponentBoundingRect } from '../hooks/useComponentBoundingRect';
import DraggableShape from '../components/shape/draggableShape';
import GameBoard from './game_board/gameBoard';
import { loadShapeDetails } from '../utils/utils';
import appConfig from '../config/config.json';
import shapeDetails from '../data/shape_details.json';
import './game.scss';
import ShapeDragLayer from '../components/shape/shapeDragLayer';


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

function getShapeIndex(shapeDetail, boundingRect, holdingPosition) {
  var { top, left, width, height } = boundingRect;

  var offset_x = holdingPosition.x - left;
  var offset_y = holdingPosition.y - top;

  var singleHoleWidth = width / shapeDetail.column;
  var singleHoleHeight = height / shapeDetail.row;

  var row, col;
  if(offset_x >= 0 && offset_x <= width
      && offset_y >= 0 && offset_y <= height) {
    var col = Math.floor(offset_x / singleHoleHeight);
    var row = Math.floor(offset_y / singleHoleWidth);
  }
  return {
    "i": row,
    "j": col
  };
}


function Game() {
  const numShapesOnBoard = appConfig["game"]["num-shapes-on-board"];

  const [currentDraggingShapeId, setCurrentDraggingShapeId] = useState(null);
  const [shapeList, setShapeList] = useState(
    createNewShapeListWithDetails(numShapesOnBoard));

  const gameBoardRef = useRef(null);

  const [boardBoundingRect] = useComponentBoundingRect(gameBoardRef);
  const shapeSizes = useRef([...Array(numShapesOnBoard)]);

  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();
  
  useEffect(() => monitor.subscribeToOffsetChange(() => {
    const offset = monitor.getClientOffset();
  }), [monitor]);


  const handleDrop = (id) => {
    setCurrentDraggingShapeId(null);
  }

  const [{isOver, item, initialClientOffset}, dropElement] = useDrop(() => ({
    accept: "shape",
    drop: (item) => handleDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      initialClientOffset: monitor.getInitialClientOffset()
    })
  }));

  useEffect(() => {
    if(currentDraggingShapeId == null)
      return;

      var boundingRect = shapeSizes.current[currentDraggingShapeId];
      const { i: shape_i, j: shape_j } = getShapeIndex(
        shapeList[currentDraggingShapeId],
        boundingRect,
        initialClientOffset);
  }, [currentDraggingShapeId]);

  const getElementBoundingRect = useCallback((id, el) => {
    if(el)
      shapeSizes.current[id] = el.getBoundingClientRect();
  }, []);

  return (
    <div className='game-wrapper'>
      <GameBoard ref={ gameBoardRef } />
      <div className='shape-holder'>
        <ShapeDragLayer details={ shapeList[currentDraggingShapeId] }/>
        {
          [...shapeList.keys()].map((idx) => {
            return (
                <DraggableShape
                  id={ idx }
                  ref={ (el) => getElementBoundingRect(idx, el) }
                  onDrag={ setCurrentDraggingShapeId }
                  details={ shapeList[idx] } />
            )
          })
        }
      </div>
    </div>
  );
}

export default Game;