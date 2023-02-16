import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDragDropManager, useDrop } from "react-dnd";
import DraggableShape from "../components/shape/draggableShape";
import ShapeDragLayer from "../components/shape/shapeDragLayer";
import GameBoard from "./game_board/gameBoard";
import Scoreboard from "./scoreboard";
import appConfig from "../config/config.json";
import "./gameView.scss";

function getIndexOnGrid(gridDetail, boundingRect, holdingPosition) {
  var { top, left, width, height } = boundingRect;

  var offset_x = holdingPosition.x - left;
  var offset_y = holdingPosition.y - top;

  var singleHoleWidth = width / gridDetail.column;
  var singleHoleHeight = height / gridDetail.row;

  var row, col;
  if (
    offset_x >= 0 &&
    offset_x <= width &&
    offset_y >= 0 &&
    offset_y <= height
  ) {
    var col = Math.floor(offset_x / singleHoleHeight);
    var row = Math.floor(offset_y / singleHoleWidth);
  }

  if (row == null || col == null) return null;

  return {
    i: row,
    j: col,
  };
}

function GameView({ matrix, shapeList, checkFillPossible, notifyDrop }) {
  const numShapesOnBoard = appConfig["game"]["num-shapes-on-board"];

  const [currentDraggingShapeId, setCurrentDraggingShapeId] = useState(null);
  const [locationOnBoard, setLocationOnBoard] = useState(null);
  const [lastUpdatedPositionTime, setLastUpdatedPositionTime] = useState(null);

  const shapeSizes = useRef([...Array(numShapesOnBoard)]);
  const gameBoardRef = useRef(null);

  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();

  const [{ isOver, item, initialClientOffset }, dropElement] = useDrop(
    () => ({
      accept: "shape",
      drop: (item) => handleDrop(item.id),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        initialClientOffset: monitor.getInitialClientOffset(),
      }),
    }),
    [currentDraggingShapeId, locationOnBoard]
  );

  useEffect(
    () =>
      monitor.subscribeToOffsetChange(() => {
        // throttling change events
        const now = new Date().getTime();
        if (now - lastUpdatedPositionTime <= 150) {
          return;
        }
        setLastUpdatedPositionTime(now);

        const offset = monitor.getClientOffset();
        if (!offset || !gameBoardRef.current) return;

        const loc = getIndexOnGrid(
          {
            row: numShapesOnBoard ** 2,
            column: numShapesOnBoard ** 2,
          },
          gameBoardRef.current,
          offset
        );

        setLocationOnBoard(loc);
      }),
    [monitor, lastUpdatedPositionTime]
  );

  useEffect(() => {
    if (currentDraggingShapeId == null || locationOnBoard == null) {
      checkFillPossible(null, null, null);
      return;
    }

    var boundingRect = shapeSizes.current[currentDraggingShapeId];
    var shapeLoc = getIndexOnGrid(
      shapeList[currentDraggingShapeId],
      boundingRect,
      initialClientOffset
    );

    if (shapeLoc == null) {
      checkFillPossible(null, null, null);
      return;
    }

    const { i: shape_i, j: shape_j } = shapeLoc;
    const { i, j } = locationOnBoard;
    checkFillPossible(
      i - shape_i,
      j - shape_j,
      shapeList[currentDraggingShapeId]["id"]
    );
  }, [locationOnBoard, currentDraggingShapeId]);

  const handleDrop = (id) => {
    if (locationOnBoard == null) {
      notifyDrop(null, null, null);
      setCurrentDraggingShapeId(null);
      setLocationOnBoard(null);
      return;
    }

    var boundingRect = shapeSizes.current[id];
    var shapeLoc = getIndexOnGrid(
      shapeList[id],
      boundingRect,
      initialClientOffset
    );

    if (shapeLoc == null) {
      notifyDrop(null, null, null);
      setCurrentDraggingShapeId(null);
      setLocationOnBoard(null);
      return;
    }

    const { i: shape_i, j: shape_j } = shapeLoc;
    const { i, j } = locationOnBoard;
    notifyDrop(i - shape_i, j - shape_j, shapeList[id]["id"]);

    setCurrentDraggingShapeId(null);
    setLocationOnBoard(null);
  };

  const getBoardBoundingRect = useCallback((el) => {
    if (el) gameBoardRef.current = el.getBoundingClientRect();
  }, []);

  const getElementBoundingRect = useCallback((id, el) => {
    if (el) shapeSizes.current[id] = el.getBoundingClientRect();
  }, []);

  return (
    <div className="game-wrapper">
      <Scoreboard />
      <div className="game-view-board-wrapper">
        <GameBoard
          matrix={matrix}
          ref={(el) => {
            getBoardBoundingRect(el);
            dropElement(el);
          }}
        />
      </div>
      <div className="shape-holder">
        <ShapeDragLayer details={shapeList[currentDraggingShapeId]} />
        {[...shapeList.keys()].map((idx) => {
          return (
            <DraggableShape
              key={idx}
              id={idx}
              ref={(el) => getElementBoundingRect(idx, el)}
              onDrag={setCurrentDraggingShapeId}
              details={shapeList[idx]}
            />
          );
        })}
      </div>
    </div>
  );
}

export default GameView;
