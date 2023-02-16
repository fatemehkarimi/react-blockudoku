import React from "react";
import Hole from "../hole/hole";
import "./shape.scss";

function Shape(props, ref) {
  const details = props.details;
  const row = details["row"];
  const column = details["column"];
  const matrix = details["matrix"];
  const rotate = details["rotate"];

  const gridStyle = {
    gridTemplateColumns: `repeat(${column}, 1fr)`,
    gridTemplateRows: `repeat(${row}, 1fr)`,
  };

  const buildShapeComponents = () => {
    const shapeComponents = [];
    for (let i = 0; i < row; ++i)
      for (let j = 0; j < column; ++j) {
        shapeComponents.push(
          <Hole
            key={"" + i.toString() + j.toString()}
            className={`${matrix[i][j] == 1 ? "filled-hole" : "empty-hole"}`}
          />
        );
      }
    return shapeComponents;
  };

  return (
    <div
      ref={ref}
      className="shape-wrapper"
      style={{ ...gridStyle, ...props.style }}
    >
      {buildShapeComponents()}
    </div>
  );
}

export default React.forwardRef(Shape);
