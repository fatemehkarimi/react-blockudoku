import React, { useState } from 'react';
import "./board.scss";

function Board(props, ref) {
  const [divStyle, setDivStyle] = useState({
    gridTemplateColumns: `repeat(${ props.size }, 1fr)`,
    gridTemplateRows: `repeat(${ props.size }, 1fr)`
  });

  return (
    <div
     ref={ ref }
     className={ `board ${ props.className ? props.className : '' }` }
     style={ divStyle }>
      { props.children }
    </div>
  );
}

export default React.forwardRef(Board);