import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import DraggableShape from '../components/shape/draggableShape';
import ShapeDragLayer from '../components/shape/shapeDragLayer';
import GameBoard from './game_board/gameBoard';
import appConfig from '../config/config.json';
import './gameView.scss';


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

  if(row == null || col == null)
    return null;

  return {
    "i": row,
    "j": col
  };
}


function GameView({ matrix, shapeList, checkFillPossible }) {
  const numShapesOnBoard = appConfig["game"]["num-shapes-on-board"];

  const [currentDraggingShapeId, setCurrentDraggingShapeId] = useState(null);
  const [locationOnBoard, setLocationOnBoard] = useState(null);

  const shapeSizes = useRef([...Array(numShapesOnBoard)]);
  const gameBoardRef = useRef(null);

  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();

  const [{isOver, item, initialClientOffset}, dropElement] = useDrop(() => ({
    accept: "shape",
    drop: (item) => handleDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      initialClientOffset: monitor.getInitialClientOffset()
    })
  }));

  useEffect(() => monitor.subscribeToOffsetChange(() => {
    const offset = monitor.getClientOffset();
    if(!offset || !gameBoardRef.current)
      return;

    const loc = getIndexOnGrid({
      row: numShapesOnBoard ** 2,
      column: numShapesOnBoard ** 2
    }, gameBoardRef.current, offset);

    setLocationOnBoard(loc);
  }), [monitor]);

  const handleDrop = (id) => {
    setLocationOnBoard(null);
    setCurrentDraggingShapeId(null);
  }

  useEffect(() => {
    if(currentDraggingShapeId == null || locationOnBoard == null)
      return;

    var boundingRect = shapeSizes.current[currentDraggingShapeId];
    const { i: shape_i, j: shape_j } = getIndexOnGrid(
      shapeList[currentDraggingShapeId],
      boundingRect,
      initialClientOffset);

    const { i, j } = locationOnBoard;
    checkFillPossible(i - shape_i, j - shape_j, currentDraggingShapeId);
  }, [locationOnBoard, currentDraggingShapeId]);

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
      <GameBoard matrix={ matrix } ref={ (el) => getBoardBoundingRect(el) } />
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

export default GameView;