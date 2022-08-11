import React from 'react'
import Shape from './shape';

function ShapeDragPreview(props) {
  if(!props.details)
    return <></>;

  return (
    <div style= {  { opacity: 1 } } >
      <Shape details={ props.details } />
    </div>
  );
}

export default ShapeDragPreview;