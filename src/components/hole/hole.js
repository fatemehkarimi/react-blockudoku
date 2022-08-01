import React from 'react';
import './hole.scss';

function Hole(props) {
  return (
    <div className={ `hole ${ props.className }` } style={ props.style }>
    </div>
  );
}

export default Hole;