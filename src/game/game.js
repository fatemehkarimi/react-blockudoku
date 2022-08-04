import React, { useState, useEffect, useRef } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import Shape from '../components/shape/shape';
import GameBoard from './game_board/gameBoard';
import { loadShapeDetails } from '../utils/utils';
import shapeDetails from '../data/shape_details.json';
import './game.scss';


function Game() {
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

  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();

  useEffect(() => monitor.subscribeToOffsetChange(() => {
    const offset = monitor.getClientOffset();
    console.log(offset);
  }), [monitor]);

  const handleDrop = (id) => {}

  const [{isOver, offset}, dropElement] = useDrop(() => ({
    accept: "shape",
    drop: (item) => handleDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div className='game-wrapper'>
      <GameBoard ref={ gameBoardRef } />
      <div className='shape-holder'>
          <Shape id={ 1 } details={ loadShapeDetails(shapeDetails[5]) } />
          <Shape id={ 2 } details={ loadShapeDetails(shapeDetails[15]) } />
          <Shape id={ 3 } details={ loadShapeDetails(shapeDetails[23]) } />
      </div>
    </div>
  );
}

export default Game;