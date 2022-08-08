import React, { useState, useEffect, useRef } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
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

  const gameBoardRef = useRef(null);
  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();

  const [boardBounding, setBoardBounding] = useState({});
  const [shapeBounding, setShapeBounding] = useState({});
  const [currentDraggingShapeId, setCurrentDraggingShapeId] = useState(null);

  const [shapes, setShapes] = useState(
      createNewShapeListWithDetails(numShapesOnBoard));

  const getPosition = () => {
    setBoardBounding(
      gameBoardRef.current.getBoundingClientRect()
    );
  };

  useEffect(() => {
    getPosition();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", getPosition, true);

    return () => {
      window.removeEventListener("resize", getPosition, true);
    };
  }, []);

  useEffect(() => monitor.subscribeToOffsetChange(() => {
    const offset = monitor.getClientOffset();
  }), [monitor]);

  useEffect(() => {
    if(!currentDraggingShapeId)
      return;

    
  }, [currentDraggingShapeId]);

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

  return (
    <div className='game-wrapper'>
      <GameBoard ref={ gameBoardRef } />
      <div className='shape-holder'>
        {
          [...Array(3).keys()].map((idx) => {
            return <Shape
                    id={ idx }
                    onDrag={ setCurrentDraggingShapeId }
                    details={ shapes[idx] } />
          })
        }
      </div>
    </div>
  );
}

export default Game;