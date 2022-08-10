import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import { useComponentBoundingRect } from '../hooks/useComponentBoundingRect';
import Shape from '../components/shape/shape';
import GameBoard from './game_board/gameBoard';
import { loadShapeDetails } from '../utils/utils';
import appConfig from '../config/config.json';
import shapeDetails from '../data/shape_details.json';
import './game.scss';


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
    console.log("id = ", id);
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
  }, [currentDraggingShapeId]);

  const getElementBoundingRect = useCallback((id, el) => {
    if(el)
      shapeSizes.current[id] = el.getBoundingClientRect();
  }, []);

  return (
    <div className='game-wrapper'>
      <GameBoard ref={ gameBoardRef } />
      <div className='shape-holder'>
        {
          [...shapeList.keys()].map((idx) => {
            return <Shape
                    id={ idx }
                    ref={ (el) => getElementBoundingRect(idx, el) }
                    onDrag={ setCurrentDraggingShapeId }
                    details={ shapeList[idx] } />
          })
        }
      </div>
    </div>
  );
}

export default Game;