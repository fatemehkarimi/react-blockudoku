import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
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

function getIndexOnGrid(gridDetail, boundingRect, holdingPosition) {
  var { top, left, width, height } = boundingRect;

  var offset_x = holdingPosition.x - left;
  var offset_y = holdingPosition.y - top;

  var singleHoleWidth = width / gridDetail.column;
  var singleHoleHeight = height / gridDetail.row;

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

  const shapeSizes = useRef([...Array(numShapesOnBoard)]);
  const gameBoardRef = useRef(null);

  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();
  
  useEffect(() => monitor.subscribeToOffsetChange(() => {
    const offset = monitor.getClientOffset();
    if(!offset || !gameBoardRef.current)
      return;

    const {i: board_i, j: board_j} = getIndexOnGrid({
        row: numShapesOnBoard ** 2,
        column: numShapesOnBoard ** 2
      }, gameBoardRef.current, offset);
    
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
      const { i: shape_i, j: shape_j } = getIndexOnGrid(
        shapeList[currentDraggingShapeId],
        boundingRect,
        initialClientOffset);
  }, [currentDraggingShapeId]);

  const getBoardBoundingRect = useCallback((el) => {
    if(el)
      gameBoardRef.current = el.getBoundingClientRect();
  }, []);

  const getElementBoundingRect = useCallback((id, el) => {
    if(el)
      shapeSizes.current[id] = el.getBoundingClientRect();
  }, []);

  return (
    <div className='game-wrapper'>
      <GameBoard ref={ (el) => getBoardBoundingRect(el) } />
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