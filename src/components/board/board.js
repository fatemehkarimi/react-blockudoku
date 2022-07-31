import React, { useState } from 'react';
import "./board.scss";

function Board(props) {
  const [divStyle, setDivStyle] = useState({
    gridTemplateColumns: `repeat(${ props.size }, 1fr)`,
    gridTemplateRows: `repeat(${ props.size }, 1fr)`
  });

  return (
    <div className={ `board ${ props.className }` } style={ divStyle }>
      {
        [...Array(props.size ** 2)].map(() => {
          return <>{ props.children }</>
        })
      }
    </div>
  );
}

export default Board;