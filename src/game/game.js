import React, { useState, useEffect, useRef } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import Hole from '../components/hole/hole';
import Board from '../components/board/board';
import Shape from '../components/shape/shape';
import { loadShapeDetails } from '../utils/utils';
import appConfig from '../config/config.json';
import shapeDetails from '../data/shape_details.json';
import './game.scss';


function GameBoard() {
  const size = appConfig["game"]["unit-board-size"];
  const gameBoardRef = useRef(null);

  const getPosition = () => {
    console.log(gameBoardRef.current.getBoundingClientRect());
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

  return (
    <div className='game-board-wrapper'>
      <Board ref={ gameBoardRef } size={ size }>
        <Board className='game-board' size={ size }>
          <Hole className='game-board-hole' />
        </Board>
      </Board>
    </div>
  );
}


function Game() {
  // const dragDropManager = useDragDropManager();
  // const monitor = dragDropManager.getMonitor();

  // useEffect(() => monitor.subscribeToOffsetChange(() => {
  //   const offset = monitor.getClientOffset();
  //   console.log(offset);

  //   if(gameBoardRef.current) {
  //     const x = dropElement.current.offsetLeft;
  //     const y = dropElement.current.offsetTop;
  //     console.log("x, y : ", x, y);
  //   }
  // }), [monitor]);

  // const handleDrop = (id) => {}

  // const [{isOver, offset}, dropElement] = useDrop(() => ({
  //   accept: "shape",
  //   drop: (item) => handleDrop(item.id),
  //   collect: (monitor) => ({
  //     isOver: !!monitor.isOver()
  //   })
  // }));

  return (
    <div className='game-wrapper'>
      <GameBoard />
      <div className='shape-holder'>
          <Shape id={ 1 } details={ loadShapeDetails(shapeDetails[5]) } />
          <Shape id={ 2 } details={ loadShapeDetails(shapeDetails[15]) } />
          <Shape id={ 3 } details={ loadShapeDetails(shapeDetails[23]) } />
      </div>
    </div>
  );
}

export default Game;