import React, { useState, useEffect, useRef } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import Shape from '../components/shape/shape';
import GameBoard from './game_board/gameBoard';
import { loadShapeDetails } from '../utils/utils';
import shapeDetails from '../data/shape_details.json';
import './game.scss';


function getRandomShape() {
  var idx = Math.floor(Math.random() * shapeDetails.length);
  return shapeDetails[idx];
}


function Game() {
  const gameBoardRef = useRef(null);
  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();
  const [boardBounding, setBoardBounding] = useState({});
  const [shapes, setShapes] = useState([
    loadShapeDetails(getRandomShape()),
    loadShapeDetails(getRandomShape()),
    loadShapeDetails(getRandomShape())
  ]);

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
        {
          [...Array(3).keys()].map((idx) => {
            return <Shape id={ idx } details={ shapes[idx] } />
          })
        }
      </div>
    </div>
  );
}

export default Game;